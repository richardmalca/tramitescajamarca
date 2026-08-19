<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCorrectionRequest;
use App\Models\Guide;
use App\Services\CorrectionService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;

class CorrectionController extends Controller
{
    public function __construct(
        private readonly CorrectionService $corrections,
    ) {}

    public function store(StoreCorrectionRequest $request, Guide $guide): RedirectResponse
    {
        $this->corrections->submit(
            $guide,
            $request->validated('message'),
            $request->validated('name'),
            $request->validated('email'),
        );

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Gracias, revisaremos tu corrección pronto.'),
        ]);

        return back();
    }
}
