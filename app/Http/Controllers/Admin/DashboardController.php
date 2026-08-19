<?php

namespace App\Http\Controllers\Admin;

use App\Enums\GuideStatus;
use App\Http\Controllers\Controller;
use App\Models\Correction;
use App\Models\Guide;
use App\Models\MissedSearch;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/dashboard', [
            'stats' => [
                'published_guides' => Guide::where('status', GuideStatus::Published)->count(),
                'draft_guides' => Guide::where('status', GuideStatus::Draft)->count(),
                'pending_corrections' => Correction::where('status', 'pending')->count(),
                'unresolved_missed_searches' => MissedSearch::whereNull('resolved_at')->count(),
            ],
        ]);
    }
}
