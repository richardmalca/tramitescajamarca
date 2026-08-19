<?php

use App\Models\User;

test('the admin panel is accessible to an admin', function () {
    $this->withoutVite();

    $response = $this->actingAs(adminUser())->get(route('admin.dashboard'));

    $response->assertOk();
});

test('a non-admin user cannot access the admin panel', function () {
    $user = User::factory()->create(['is_admin' => false]);

    $response = $this->actingAs($user)->get(route('admin.dashboard'));

    $response->assertForbidden();
});

test('a guest is redirected to login for the admin panel', function () {
    $response = $this->get(route('admin.dashboard'));

    $response->assertRedirect(route('login'));
});
