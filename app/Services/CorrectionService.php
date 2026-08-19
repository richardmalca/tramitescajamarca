<?php

namespace App\Services;

use App\Enums\CorrectionStatus;
use App\Models\Correction;
use App\Models\Guide;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class CorrectionService
{
    public function submit(Guide $guide, string $message, ?string $name, ?string $email): Correction
    {
        return $guide->corrections()->create([
            'name' => $name,
            'email' => $email,
            'message' => $message,
            'status' => CorrectionStatus::Pending,
        ]);
    }

    /**
     * @return LengthAwarePaginator<int, Correction>
     */
    public function listPending(): LengthAwarePaginator
    {
        return Correction::query()
            ->with('guide:id,title,slug')
            ->where('status', CorrectionStatus::Pending)
            ->orderBy('created_at')
            ->paginate(20)
            ->withQueryString();
    }

    public function markApplied(Correction $correction): void
    {
        $correction->update(['status' => CorrectionStatus::Applied]);
    }

    public function markDismissed(Correction $correction): void
    {
        $correction->update(['status' => CorrectionStatus::Dismissed]);
    }
}
