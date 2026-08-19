<?php

namespace Database\Factories;

use App\Enums\CorrectionStatus;
use App\Models\Correction;
use App\Models\Guide;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Correction>
 */
class CorrectionFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'guide_id' => Guide::factory(),
            'name' => fake()->name(),
            'email' => fake()->safeEmail(),
            'message' => fake()->sentence(),
            'status' => CorrectionStatus::Pending,
        ];
    }
}
