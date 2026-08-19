<?php

namespace App\Http\Controllers;

use App\Services\CategoryService;
use App\Services\GuideService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __construct(
        private readonly GuideService $guides,
        private readonly CategoryService $categories,
    ) {}

    public function index(Request $request): Response
    {
        return Inertia::render('home', [
            'categories' => $this->categories->listWithPublishedGuides(),
            'recentGuides' => $this->guides->search(null, null, 6)->items(),
        ]);
    }
}
