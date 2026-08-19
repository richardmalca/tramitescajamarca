<?php

use App\Enums\GuideStatus;
use App\Models\Category;
use App\Models\Guide;
use App\Models\MissedSearch;

test('the home page lists categories that have published guides', function () {
    $this->withoutVite();

    $withGuide = Category::factory()->create(['name' => 'Identidad']);
    Guide::factory()->create(['category_id' => $withGuide->id, 'status' => GuideStatus::Published]);

    $withoutGuide = Category::factory()->create(['name' => 'Vacía']);

    $response = $this->get(route('home'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->has('categories', 1)
        ->where('categories.0.id', $withGuide->id)
    );
});

test('the guides index only shows published guides', function () {
    $this->withoutVite();

    $published = Guide::factory()->create(['status' => GuideStatus::Published]);
    Guide::factory()->draft()->create();

    $response = $this->get(route('guides.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->has('guides.data', 1)
        ->where('guides.data.0.id', $published->id)
    );
});

test('searching guides filters by title and summary', function () {
    $this->withoutVite();

    $match = Guide::factory()->create(['title' => 'Renovar tu DNI', 'status' => GuideStatus::Published]);
    Guide::factory()->create(['title' => 'Licencia de conducir', 'status' => GuideStatus::Published]);

    $response = $this->get(route('guides.index', ['q' => 'DNI']));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->has('guides.data', 1)
        ->where('guides.data.0.id', $match->id)
    );
});

test('a search with zero results is logged as a missed search', function () {
    $this->withoutVite();

    expect(MissedSearch::count())->toBe(0);

    $this->get(route('guides.index', ['q' => 'algo que no existe']));

    expect(MissedSearch::count())->toBe(1);
    expect(MissedSearch::first()->query)->toBe('algo que no existe');
});

test('a repeated missed search increments occurrences instead of duplicating', function () {
    $this->withoutVite();

    $this->get(route('guides.index', ['q' => 'partida de matrimonio']));
    $this->get(route('guides.index', ['q' => 'partida de matrimonio']));

    expect(MissedSearch::count())->toBe(1);
    expect(MissedSearch::first()->occurrences)->toBe(2);
});

test('a guide with a category filter that has results does not log a missed search', function () {
    $this->withoutVite();

    Guide::factory()->create(['title' => 'Renovar tu DNI', 'status' => GuideStatus::Published]);

    $this->get(route('guides.index', ['q' => 'DNI']));

    expect(MissedSearch::count())->toBe(0);
});

test('a published guide can be viewed by slug', function () {
    $this->withoutVite();

    $guide = Guide::factory()->create(['status' => GuideStatus::Published]);

    $response = $this->get(route('guides.show', $guide->slug));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->where('guide.id', $guide->id));
});

test('a draft guide 404s for visitors', function () {
    $guide = Guide::factory()->draft()->create();

    $response = $this->get(route('guides.show', $guide->slug));

    $response->assertNotFound();
});

test('a guide with structured steps exposes them to the page', function () {
    $this->withoutVite();

    $guide = Guide::factory()->create([
        'status' => GuideStatus::Published,
        'steps' => [
            ['text' => 'Agenda tu cita', 'link' => 'https://www.reniec.gob.pe', 'link_label' => 'Agendar cita', 'image' => null],
            ['text' => 'Paga la tasa', 'link' => null, 'link_label' => null, 'image' => null],
        ],
    ]);

    $response = $this->get(route('guides.show', $guide->slug));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->has('guide.steps', 2)
        ->where('guide.steps.0.text', 'Agenda tu cita')
        ->where('guide.steps.0.link', 'https://www.reniec.gob.pe')
        ->where('guide.steps.1.link', null)
    );
});
