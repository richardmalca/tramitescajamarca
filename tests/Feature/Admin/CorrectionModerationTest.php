<?php

use App\Enums\CorrectionStatus;
use App\Models\Correction;

test('an admin can mark a correction as applied', function () {
    $correction = Correction::factory()->create();

    $response = $this->actingAs(adminUser())->patch(route('admin.corrections.apply', $correction));

    $response->assertRedirect(route('admin.corrections.index'));
    expect($correction->fresh()->status)->toBe(CorrectionStatus::Applied);
});

test('an admin can dismiss a correction', function () {
    $correction = Correction::factory()->create();

    $response = $this->actingAs(adminUser())->patch(route('admin.corrections.dismiss', $correction));

    $response->assertRedirect(route('admin.corrections.index'));
    expect($correction->fresh()->status)->toBe(CorrectionStatus::Dismissed);
});

test('the corrections list only shows pending ones', function () {
    $this->withoutVite();

    $pending = Correction::factory()->create();
    Correction::factory()->create(['status' => CorrectionStatus::Applied]);

    $response = $this->actingAs(adminUser())->get(route('admin.corrections.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->has('corrections.data', 1)
        ->where('corrections.data.0.id', $pending->id)
    );
});
