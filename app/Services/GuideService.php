<?php

namespace App\Services;

use App\Enums\GuideStatus;
use App\Models\Category;
use App\Models\Guide;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Str;

class GuideService
{
    public function __construct(
        private readonly MissedSearchService $missedSearches,
    ) {}

    /**
     * @return LengthAwarePaginator<int, Guide>
     */
    public function search(?string $query, ?Category $category, int $perPage = 12): LengthAwarePaginator
    {
        $guides = Guide::query()
            ->with('category:id,name,slug')
            ->where('status', GuideStatus::Published)
            ->when($category, fn ($builder) => $builder->where('category_id', $category->id))
            ->when($query, fn ($builder) => $builder->where(
                fn ($inner) => $inner->where('title', 'like', "%{$query}%")
                    ->orWhere('summary', 'like', "%{$query}%")
            ))
            ->orderByDesc('published_at')
            ->paginate($perPage)
            ->withQueryString();

        if ($query !== null && $query !== '' && $guides->total() === 0) {
            $this->missedSearches->record($query);
        }

        return $guides;
    }

    public function findPublishedBySlug(string $slug): Guide
    {
        return Guide::query()
            ->with('category:id,name,slug')
            ->where('slug', $slug)
            ->where('status', GuideStatus::Published)
            ->firstOrFail();
    }

    /**
     * @return LengthAwarePaginator<int, Guide>
     */
    public function listAllPaginated(): LengthAwarePaginator
    {
        return Guide::query()
            ->with('category:id,name,slug')
            ->orderByDesc('created_at')
            ->paginate(20)
            ->withQueryString();
    }

    /**
     * @param  array<string, mixed>  $attributes
     */
    public function create(array $attributes, int $createdBy): Guide
    {
        $attributes['slug'] = $this->uniqueSlug($attributes['title']);
        $attributes['created_by'] = $createdBy;

        if (($attributes['status'] ?? null) === GuideStatus::Published->value && empty($attributes['published_at'])) {
            $attributes['published_at'] = now();
        }

        return Guide::create($attributes);
    }

    /**
     * @param  array<string, mixed>  $attributes
     */
    public function update(Guide $guide, array $attributes): Guide
    {
        if ($attributes['title'] !== $guide->title) {
            $attributes['slug'] = $this->uniqueSlug($attributes['title'], $guide->id);
        }

        if (($attributes['status'] ?? null) === GuideStatus::Published->value && $guide->published_at === null) {
            $attributes['published_at'] = now();
        }

        $guide->update($attributes);

        return $guide;
    }

    public function delete(Guide $guide): void
    {
        $guide->delete();
    }

    private function uniqueSlug(string $title, ?int $ignoreId = null): string
    {
        $base = Str::slug($title);
        $slug = $base;
        $suffix = 1;

        while (Guide::where('slug', $slug)->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))->exists()) {
            $slug = "{$base}-".++$suffix;
        }

        return $slug;
    }
}
