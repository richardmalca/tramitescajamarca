<?php

use App\Enums\GuideStatus;
use App\Models\Category;
use App\Models\Guide;
use App\Models\User;

test('an admin can create a published guide', function () {
    $admin = adminUser();
    $category = Category::factory()->create();

    $response = $this->actingAs($admin)->post(route('admin.guides.store'), [
        'category_id' => $category->id,
        'title' => 'Renovar tu DNI',
        'summary' => 'Cómo renovar tu DNI en Cajamarca',
        'content' => 'Contenido completo del trámite...',
        'cost' => 'S/ 31.30',
        'where_to_go' => 'RENIEC Cajamarca',
        'requirements' => ['DNI anterior'],
        'status' => 'published',
    ]);

    $response->assertRedirect(route('admin.guides.index'));

    $guide = Guide::where('title', 'Renovar tu DNI')->firstOrFail();
    expect($guide->slug)->toBe('renovar-tu-dni');
    expect($guide->status)->toBe(GuideStatus::Published);
    expect($guide->published_at)->not->toBeNull();
    expect($guide->created_by)->toBe($admin->id);
});

test('a draft guide has no published_at date', function () {
    $category = Category::factory()->create();

    $this->actingAs(adminUser())->post(route('admin.guides.store'), [
        'category_id' => $category->id,
        'title' => 'Trámite en borrador',
        'summary' => 'Resumen',
        'content' => 'Contenido',
        'status' => 'draft',
    ]);

    $guide = Guide::where('title', 'Trámite en borrador')->firstOrFail();
    expect($guide->published_at)->toBeNull();
});

test('creating two guides with the same title gets a unique slug', function () {
    $category = Category::factory()->create();
    $admin = adminUser();

    $this->actingAs($admin)->post(route('admin.guides.store'), [
        'category_id' => $category->id,
        'title' => 'Sacar tu brevete',
        'summary' => 'Resumen',
        'content' => 'Contenido',
        'status' => 'published',
    ]);

    $this->actingAs($admin)->post(route('admin.guides.store'), [
        'category_id' => $category->id,
        'title' => 'Sacar tu brevete',
        'summary' => 'Otro resumen',
        'content' => 'Otro contenido',
        'status' => 'published',
    ]);

    expect(Guide::where('title', 'Sacar tu brevete')->pluck('slug')->all())
        ->toBe(['sacar-tu-brevete', 'sacar-tu-brevete-2']);
});

test('an admin can update a guide', function () {
    $guide = Guide::factory()->create(['title' => 'Título viejo']);

    $response = $this->actingAs(adminUser())->put(route('admin.guides.update', $guide), [
        'category_id' => $guide->category_id,
        'title' => 'Título actualizado',
        'summary' => $guide->summary,
        'content' => $guide->content,
        'status' => $guide->status->value,
    ]);

    $response->assertRedirect(route('admin.guides.index'));
    expect($guide->fresh()->title)->toBe('Título actualizado');
    expect($guide->fresh()->slug)->toBe('titulo-actualizado');
});

test('an admin can delete a guide', function () {
    $guide = Guide::factory()->create();

    $response = $this->actingAs(adminUser())->delete(route('admin.guides.destroy', $guide));

    $response->assertRedirect(route('admin.guides.index'));
    expect(Guide::find($guide->id))->toBeNull();
});

test('an admin can create a guide with structured steps', function () {
    $admin = adminUser();
    $category = Category::factory()->create();

    $response = $this->actingAs($admin)->post(route('admin.guides.store'), [
        'category_id' => $category->id,
        'title' => 'Sacar tu licencia de conducir',
        'summary' => 'Resumen',
        'content' => 'Contenido',
        'status' => 'published',
        'steps' => [
            ['text' => 'Agenda tu cita', 'link' => 'https://www.reniec.gob.pe', 'link_label' => 'Agendar cita', 'image' => null],
            ['text' => 'Paga la tasa', 'link' => null, 'link_label' => null, 'image' => null],
        ],
    ]);

    $response->assertRedirect(route('admin.guides.index'));

    $guide = Guide::where('title', 'Sacar tu licencia de conducir')->firstOrFail();
    expect($guide->steps)->toHaveCount(2);
    expect($guide->steps[0]['text'])->toBe('Agenda tu cita');
    expect($guide->steps[0]['link'])->toBe('https://www.reniec.gob.pe');
});

test('a guide step link must be a valid url', function () {
    $admin = adminUser();
    $category = Category::factory()->create();

    $response = $this->actingAs($admin)->post(route('admin.guides.store'), [
        'category_id' => $category->id,
        'title' => 'Trámite con link inválido',
        'summary' => 'Resumen',
        'content' => 'Contenido',
        'status' => 'published',
        'steps' => [
            ['text' => 'Paso con link roto', 'link' => 'no-es-una-url', 'link_label' => null, 'image' => null],
        ],
    ]);

    $response->assertSessionHasErrors('steps.0.link');
});

test('a non-admin cannot create a guide', function () {
    $user = User::factory()->create(['is_admin' => false]);
    $category = Category::factory()->create();

    $response = $this->actingAs($user)->post(route('admin.guides.store'), [
        'category_id' => $category->id,
        'title' => 'Intento no autorizado',
        'summary' => 'Resumen',
        'content' => 'Contenido',
        'status' => 'published',
    ]);

    $response->assertForbidden();
    expect(Guide::where('title', 'Intento no autorizado')->exists())->toBeFalse();
});
