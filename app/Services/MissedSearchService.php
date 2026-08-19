<?php

namespace App\Services;

use App\Models\MissedSearch;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class MissedSearchService
{
    /**
     * Log a search that returned zero results, or bump its counter if it's
     * already been logged. This is the raw feed Phase 2's AI agent will
     * read from to decide what content to write next.
     */
    public function record(string $query): void
    {
        $normalized = mb_strtolower(trim($query));

        if ($normalized === '') {
            return;
        }

        $existing = MissedSearch::whereRaw('LOWER(query) = ?', [$normalized])->first();

        if ($existing) {
            $existing->increment('occurrences');

            return;
        }

        MissedSearch::create(['query' => $query]);
    }

    /**
     * @return LengthAwarePaginator<int, MissedSearch>
     */
    public function listUnresolved(): LengthAwarePaginator
    {
        return MissedSearch::query()
            ->whereNull('resolved_at')
            ->orderByDesc('occurrences')
            ->paginate(20)
            ->withQueryString();
    }

    public function resolve(MissedSearch $missedSearch): void
    {
        $missedSearch->update(['resolved_at' => now()]);
    }
}
