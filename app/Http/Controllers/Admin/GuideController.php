<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreGuideRequest;
use App\Http\Requests\UpdateGuideRequest;
use App\Models\Guide;
use App\Services\CategoryService;
use App\Services\GuideService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class GuideController extends Controller
{
    public function __construct(
        private readonly GuideService $guides,
        private readonly CategoryService $categories,
    ) {}

    public function index(): Response
    {
        return Inertia::render('admin/guides/index', [
            'guides' => $this->guides->listAllPaginated(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/guides/create', [
            'categories' => $this->categories->listAll(),
        ]);
    }

    public function store(StoreGuideRequest $request): RedirectResponse
    {
        $this->guides->create($request->validated(), $request->user()->id);

        return redirect()->route('admin.guides.index');
    }

    public function edit(Guide $guide): Response
    {
        return Inertia::render('admin/guides/edit', [
            'guide' => $guide,
            'categories' => $this->categories->listAll(),
        ]);
    }

    public function update(UpdateGuideRequest $request, Guide $guide): RedirectResponse
    {
        $this->guides->update($guide, $request->validated());

        return redirect()->route('admin.guides.index');
    }

    public function destroy(Request $request, Guide $guide): RedirectResponse
    {
        $this->guides->delete($guide);

        return redirect()->route('admin.guides.index');
    }
}
