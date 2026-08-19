<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Throwable;

/**
 * Sends a Telegram message the moment an exception is reported — no cron,
 * no queue, no scheduler. It fires synchronously from the exception
 * handler itself, with a short HTTP timeout so a Telegram outage can't
 * hang the request that triggered it.
 *
 * The same error (same class + file + line) is only re-sent once every
 * ten minutes, so an error storm doesn't flood the chat.
 */
class TelegramErrorReporter
{
    private const int THROTTLE_SECONDS = 600;

    public function report(Throwable $e): void
    {
        $token = config('services.telegram.bot_token');
        $chatId = config('services.telegram.chat_id');

        if (! $token || ! $chatId) {
            return;
        }

        $key = 'telegram-error:'.md5($e::class.$e->getFile().$e->getLine());

        if (Cache::has($key)) {
            return;
        }

        Cache::put($key, true, self::THROTTLE_SECONDS);

        try {
            Http::timeout(3)->post("https://api.telegram.org/bot{$token}/sendMessage", [
                'chat_id' => $chatId,
                'text' => $this->formatMessage($e),
                'parse_mode' => 'HTML',
            ]);
        } catch (Throwable $reportingFailure) {
            // Never let a failed Telegram call turn into a second exception.
            Log::warning('No se pudo enviar el reporte de error a Telegram.', [
                'error' => $reportingFailure->getMessage(),
            ]);
        }
    }

    private function formatMessage(Throwable $e): string
    {
        $env = config('app.env');
        $file = str($e->getFile())->after(base_path().DIRECTORY_SEPARATOR);

        return sprintf(
            "🐛 <b>Error en %s</b>\n\n<b>%s</b>\n%s\n\n📄 %s:%d",
            e($env),
            e($e::class),
            e($e->getMessage()),
            e($file),
            $e->getLine(),
        );
    }
}
