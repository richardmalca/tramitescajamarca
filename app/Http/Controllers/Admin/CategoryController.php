<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCategoryRequest;
use App\Models\Category;
use App\Services\CategoryService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function __construct(
        private readonly CategoryService $categories,
    ) {}

    public function index(): Response
    {
        return Inertia::render('admin/categories/index', [
            'categories' => $this->categories->listAll(),
        ]);
    }

    public function store(StoreCategoryRequest $request): RedirectResponse
    {
        $this->categories->create($request->categoryData());

        return redirect()->route('admin.categories.index');
    }

    public function update(StoreCategoryRequest $request, Category $category): RedirectResponse
    {
        $this->categories->update($category, $request->categoryData());

        return redirect()->route('admin.categories.index');
    }

    public function destroy(Category $category): RedirectResponse
    {
        $this->categories->delete($category);

        return redirect()->route('admin.categories.index');
    }
}
