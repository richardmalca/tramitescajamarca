<?php

use App\Enums\CorrectionStatus;
use App\Enums\GuideStatus;
use App\Models\Correction;
use App\Models\Guide;

test('a visitor can submit a correction for a guide', function () {
    $guide = Guide::factory()->create(['status' => GuideStatus::Published]);

    $response = $this->post(route('corrections.store', $guide->slug), [
        'message' => 'El costo ya no es ese, ahora es S/ 15.',
        'name' => 'Ana',
        'email' => 'ana@example.com',
    ]);

    $response->assertRedirect();
    expect(Correction::count())->toBe(1);
    expect(Correction::first()->status)->toBe(CorrectionStatus::Pending);
    expect(Correction::first()->guide_id)->toBe($guide->id);
});

test('a correction requires a message', function () {
    $guide = Guide::factory()->create(['status' => GuideStatus::Published]);

    $response = $this->post(route('corrections.store', $guide->slug), []);

    $response->assertSessionHasErrors('message');
    expect(Correction::count())->toBe(0);
});

test('name and email are optional on a correction', function () {
    $guide = Guide::factory()->create(['status' => GuideStatus::Published]);

    $response = $this->post(route('corrections.store', $guide->slug), [
        'message' => 'Esto está desactualizado.',
    ]);

    $response->assertRedirect();
    expect(Correction::first()->name)->toBeNull();
    expect(Correction::first()->email)->toBeNull();
});
