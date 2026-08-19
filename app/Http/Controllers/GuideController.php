<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Services\CategoryService;
use App\Services\GuideService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class GuideController extends Controller
{
    public function __construct(
        private readonly GuideService $guides,
        private readonly CategoryService $categories,
    ) {}

    public function index(Request $request): Response
    {
        $category = $request->filled('categoria')
            ? Category::where('slug', $request->string('categoria'))->first()
            : null;

        return Inertia::render('public/guides/index', [
            'guides' => $this->guides->search($request->string('q')->value() ?: null, $category),
            'categories' => $this->categories->listWithPublishedGuides(),
            'filters' => [
                'q' => $request->string('q')->value() ?: null,
                'categoria' => $category?->slug,
            ],
        ]);
    }

    public function show(string $slug): Response
    {
        return Inertia::render('public/guides/show', [
            'guide' => $this->guides->findPublishedBySlug($slug),
        ]);
    }
}
