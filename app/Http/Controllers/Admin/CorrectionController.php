<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Correction;
use App\Services\CorrectionService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CorrectionController extends Controller
{
    public function __construct(
        private readonly CorrectionService $corrections,
    ) {}

    public function index(): Response
    {
        return Inertia::render('admin/corrections/index', [
            'corrections' => $this->corrections->listPending(),
        ]);
    }

    public function apply(Correction $correction): RedirectResponse
    {
        $this->corrections->markApplied($correction);

        return redirect()->route('admin.corrections.index');
    }

    public function dismiss(Correction $correction): RedirectResponse
    {
        $this->corrections->markDismissed($correction);

        return redirect()->route('admin.corrections.index');
    }
}
