<?php

use App\Models\MissedSearch;

test('an admin can mark a missed search as resolved', function () {
    $missedSearch = MissedSearch::factory()->create();

    $response = $this->actingAs(adminUser())->patch(route('admin.missed-searches.resolve', $missedSearch));

    $response->assertRedirect(route('admin.missed-searches.index'));
    expect($missedSearch->fresh()->resolved_at)->not->toBeNull();
});

test('the missed searches list excludes resolved ones', function () {
    $this->withoutVite();

    $unresolved = MissedSearch::factory()->create();
    MissedSearch::factory()->create(['resolved_at' => now()]);

    $response = $this->actingAs(adminUser())->get(route('admin.missed-searches.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->has('missedSearches.data', 1)
        ->where('missedSearches.data.0.id', $unresolved->id)
    );
});
