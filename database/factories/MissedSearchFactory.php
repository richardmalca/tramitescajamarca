<?php

namespace Database\Factories;

use App\Models\MissedSearch;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<MissedSearch>
 */
class MissedSearchFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'query' => fake()->words(3, true),
            'occurrences' => fake()->numberBetween(1, 5),
            'resolved_at' => null,
        ];
    }
}
