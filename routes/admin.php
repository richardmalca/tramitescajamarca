<?php

use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\CorrectionController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\GuideAiController;
use App\Http\Controllers\Admin\GuideController;
use App\Http\Controllers\Admin\MissedSearchController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'can:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('panel', [DashboardController::class, 'index'])->name('dashboard');

    Route::get('tramites', [GuideController::class, 'index'])->name('guides.index');
    Route::get('tramites/crear', [GuideController::class, 'create'])->name('guides.create');
    Route::post('tramites', [GuideController::class, 'store'])->name('guides.store');
    Route::get('tramites/{guide}/editar', [GuideController::class, 'edit'])->name('guides.edit');
    Route::put('tramites/{guide}', [GuideController::class, 'update'])->name('guides.update');
    Route::delete('tramites/{guide}', [GuideController::class, 'destroy'])->name('guides.destroy');

    Route::post('tramites/generar-ia', [GuideAiController::class, 'generate'])->name('guides.ai.generate');
    Route::post('tramites/{guide}/mejorar-ia', [GuideAiController::class, 'improve'])->name('guides.ai.improve');

    Route::get('categorias', [CategoryController::class, 'index'])->name('categories.index');
    Route::post('categorias', [CategoryController::class, 'store'])->name('categories.store');
    Route::put('categorias/{category}', [CategoryController::class, 'update'])->name('categories.update');
    Route::delete('categorias/{category}', [CategoryController::class, 'destroy'])->name('categories.destroy');

    Route::get('correcciones', [CorrectionController::class, 'index'])->name('corrections.index');
    Route::patch('correcciones/{correction}/aplicar', [CorrectionController::class, 'apply'])->name('corrections.apply');
    Route::patch('correcciones/{correction}/descartar', [CorrectionController::class, 'dismiss'])->name('corrections.dismiss');

    Route::get('busquedas-sin-resultado', [MissedSearchController::class, 'index'])->name('missed-searches.index');
    Route::patch('busquedas-sin-resultado/{missedSearch}/resolver', [MissedSearchController::class, 'resolve'])->name('missed-searches.resolve');
});
