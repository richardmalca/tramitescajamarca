<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MissedSearch;
use App\Services\MissedSearchService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class MissedSearchController extends Controller
{
    public function __construct(
        private readonly MissedSearchService $missedSearches,
    ) {}

    public function index(): Response
    {
        return Inertia::render('admin/missed-searches/index', [
            'missedSearches' => $this->missedSearches->listUnresolved(),
        ]);
    }

    public function resolve(MissedSearch $missedSearch): RedirectResponse
    {
        $this->missedSearches->resolve($missedSearch);

        return redirect()->route('admin.missed-searches.index');
    }
}
