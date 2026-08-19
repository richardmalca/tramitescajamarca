<?php

use App\Services\TelegramErrorReporter;
use Illuminate\Support\Facades\Http;

beforeEach(function () {
    config(['services.telegram.bot_token' => 'test-token', 'services.telegram.chat_id' => '12345']);
});

test('it sends a telegram message when an exception is reported', function () {
    Http::fake();

    (new TelegramErrorReporter)->report(new RuntimeException('Algo falló'));

    Http::assertSent(function ($request) {
        return str_contains($request->url(), 'api.telegram.org/bottest-token/sendMessage')
            && $request['chat_id'] === '12345'
            && str_contains($request['text'], 'Algo falló');
    });
});

test('it does not send a duplicate report for the same error within the throttle window', function () {
    Http::fake();

    $reporter = new TelegramErrorReporter;
    $exception = new RuntimeException('Error repetido');

    $reporter->report($exception);
    $reporter->report($exception);
    $reporter->report($exception);

    Http::assertSentCount(1);
});

test('it does nothing when telegram credentials are missing', function () {
    config(['services.telegram.bot_token' => null, 'services.telegram.chat_id' => null]);
    Http::fake();

    (new TelegramErrorReporter)->report(new RuntimeException('Sin credenciales'));

    Http::assertNothingSent();
});
