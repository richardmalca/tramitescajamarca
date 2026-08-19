<?php

namespace App\Services;

use App\Models\Category;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Str;

class CategoryService
{
    /**
     * @return Collection<int, Category>
     */
    public function listAll(): Collection
    {
        return Category::query()
            ->withCount('guides')
            ->orderBy('order')
            ->orderBy('name')
            ->get();
    }

    /**
     * Categories that have at least one published guide, for public browsing.
     *
     * @return Collection<int, Category>
     */
    public function listWithPublishedGuides(): Collection
    {
        return Category::query()
            ->withCount(['guides' => fn ($query) => $query->where('status', 'published')])
            ->whereHas('guides', fn ($query) => $query->where('status', 'published'))
            ->orderBy('order')
            ->orderBy('name')
            ->get();
    }

    /**
     * @param  array{name: string, description: ?string, icon: ?string, order: int}  $attributes
     */
    public function create(array $attributes): Category
    {
        $attributes['slug'] = $this->uniqueSlug($attributes['name']);

        return Category::create($attributes);
    }

    /**
     * @param  array{name: string, description: ?string, icon: ?string, order: int}  $attributes
     */
    public function update(Category $category, array $attributes): Category
    {
        if ($attributes['name'] !== $category->name) {
            $attributes['slug'] = $this->uniqueSlug($attributes['name'], $category->id);
        }

        $category->update($attributes);

        return $category;
    }

    public function delete(Category $category): void
    {
        $category->delete();
    }

    private function uniqueSlug(string $name, ?int $ignoreId = null): string
    {
        $base = Str::slug($name);
        $slug = $base;
        $suffix = 1;

        while (Category::where('slug', $slug)->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))->exists()) {
            $slug = "{$base}-".++$suffix;
        }

        return $slug;
    }
}
