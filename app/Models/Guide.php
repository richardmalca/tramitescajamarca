<?php

namespace App\Models;

use App\Enums\GuideStatus;
use Database\Factories\GuideFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $category_id
 * @property int|null $created_by
 * @property string $title
 * @property string $slug
 * @property string $summary
 * @property string $content
 * @property string|null $cost
 * @property string|null $where_to_go
 * @property array<int, string>|null $requirements
 * @property array<int, array{text: string, link: string|null, link_label: string|null, image: string|null}>|null $steps
 * @property string|null $source_url
 * @property GuideStatus $status
 * @property Carbon|null $published_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['category_id', 'created_by', 'title', 'slug', 'summary', 'content', 'cost', 'where_to_go', 'requirements', 'steps', 'source_url', 'status', 'published_at'])]
class Guide extends Model
{
    /** @use HasFactory<GuideFactory> */
    use HasFactory;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'requirements' => 'array',
            'steps' => 'array',
            'status' => GuideStatus::class,
            'published_at' => 'datetime',
        ];
    }

    /**
     * @return BelongsTo<Category, $this>
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * @return HasMany<Correction, $this>
     */
    public function corrections(): HasMany
    {
        return $this->hasMany(Correction::class);
    }
}
