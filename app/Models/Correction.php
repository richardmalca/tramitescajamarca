<?php

namespace App\Models;

use App\Enums\CorrectionStatus;
use Database\Factories\CorrectionFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $guide_id
 * @property string|null $name
 * @property string|null $email
 * @property string $message
 * @property CorrectionStatus $status
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['guide_id', 'name', 'email', 'message', 'status'])]
class Correction extends Model
{
    /** @use HasFactory<CorrectionFactory> */
    use HasFactory;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => CorrectionStatus::class,
        ];
    }

    /**
     * @return BelongsTo<Guide, $this>
     */
    public function guide(): BelongsTo
    {
        return $this->belongsTo(Guide::class);
    }
}
