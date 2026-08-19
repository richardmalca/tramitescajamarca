<?php

use App\Models\Category;
use App\Models\Guide;

test('an admin can create a category', function () {
    $response = $this->actingAs(adminUser())->post(route('admin.categories.store'), [
        'name' => 'Salud',
        'description' => 'Trámites relacionados a salud',
    ]);

    $response->assertRedirect(route('admin.categories.index'));

    $category = Category::where('name', 'Salud')->firstOrFail();
    expect($category->slug)->toBe('salud');
});

test('an admin can update a category', function () {
    $category = Category::factory()->create(['name' => 'Nombre viejo']);

    $response = $this->actingAs(adminUser())->put(route('admin.categories.update', $category), [
        'name' => 'Nombre nuevo',
    ]);

    $response->assertRedirect(route('admin.categories.index'));
    expect($category->fresh()->name)->toBe('Nombre nuevo');
    expect($category->fresh()->slug)->toBe('nombre-nuevo');
});

test('deleting a category also deletes its guides', function () {
    $category = Category::factory()->create();
    $guide = Guide::factory()->create(['category_id' => $category->id]);

    $this->actingAs(adminUser())->delete(route('admin.categories.destroy', $category));

    expect(Category::find($category->id))->toBeNull();
    expect(Guide::find($guide->id))->toBeNull();
});
