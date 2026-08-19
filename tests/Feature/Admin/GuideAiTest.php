<?php

use App\Models\Category;
use App\Models\Guide;
use App\Models\User;
use Illuminate\Support\Facades\Http;

function fakeClaudeDraft(array $input): void
{
    Http::fake([
        'api.anthropic.com/*' => Http::response([
            'content' => [
                ['type' => 'tool_use', 'name' => 'draft_guide', 'input' => $input],
            ],
        ]),
    ]);
}

beforeEach(function () {
    config(['services.anthropic.key' => 'test-key']);
});

test('an admin can generate a guide draft with ai', function () {
    $category = Category::factory()->create(['name' => 'Identidad']);

    fakeClaudeDraft([
        'title' => 'Renovar tu DNI',
        'summary' => 'Resumen generado',
        'content' => 'Contenido generado',
        'cost' => 'S/ 31.30',
        'where_to_go' => 'RENIEC',
        'requirements' => ['DNI anterior'],
        'steps' => [['text' => 'Paso uno']],
    ]);

    $response = $this->actingAs(adminUser())->postJson(route('admin.guides.ai.generate'), [
        'topic' => 'Renovar DNI',
        'category_id' => $category->id,
    ]);

    $response->assertOk();
    $response->assertJsonPath('draft.title', 'Renovar tu DNI');
    $response->assertJsonPath('draft.steps.0.text', 'Paso uno');

    // The draft is never persisted on its own.
    expect(Guide::count())->toBe(0);
});

test('an admin can improve an existing guide with ai', function () {
    $guide = Guide::factory()->create();

    fakeClaudeDraft([
        'title' => 'Título mejorado',
        'summary' => 'Resumen mejorado',
        'content' => 'Contenido mejorado',
    ]);

    $response = $this->actingAs(adminUser())->postJson(route('admin.guides.ai.improve', $guide));

    $response->assertOk();
    $response->assertJsonPath('draft.title', 'Título mejorado');

    expect($guide->fresh()->title)->not->toBe('Título mejorado');
});

test('a non-admin cannot use the ai draft endpoint', function () {
    $user = User::factory()->create(['is_admin' => false]);

    $response = $this->actingAs($user)->postJson(route('admin.guides.ai.generate'), ['topic' => 'Algo']);

    $response->assertForbidden();
});

test('it returns a clean error when anthropic is not configured', function () {
    config(['services.anthropic.key' => null]);

    $response = $this->actingAs(adminUser())->postJson(route('admin.guides.ai.generate'), ['topic' => 'Algo']);

    $response->assertStatus(422);
    $response->assertJsonPath('message', 'ANTHROPIC_API_KEY no está configurada.');
});
