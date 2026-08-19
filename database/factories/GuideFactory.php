<?php

namespace Database\Factories;

use App\Enums\GuideStatus;
use App\Models\Category;
use App\Models\Guide;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Guide>
 */
class GuideFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = ucfirst(rtrim(fake()->unique()->sentence(4), '.'));

        return [
            'category_id' => Category::factory(),
            'created_by' => null,
            'title' => $title,
            'slug' => Str::slug($title).'-'.Str::lower(Str::random(4)),
            'summary' => fake()->sentence(),
            'content' => fake()->paragraphs(4, true),
            'cost' => fake()->randomElement(['Gratuito', 'S/ 12.10', 'S/ 25.00', null]),
            'where_to_go' => fake()->randomElement(['Municipalidad Provincial de Cajamarca', 'RENIEC — Jr. Cruz de Piedra', 'Gobierno Regional de Cajamarca']),
            'requirements' => fake()->sentences(3),
            'source_url' => null,
            'status' => GuideStatus::Published,
            'published_at' => now(),
        ];
    }

    public function draft(): static
    {
        return $this->state(fn (): array => [
            'status' => GuideStatus::Draft,
            'published_at' => null,
        ]);
    }
}
