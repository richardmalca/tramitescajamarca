<?php

use App\Http\Controllers\CorrectionController;
use App\Http\Controllers\GuideController;
use App\Http\Controllers\HomeController;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'index'])->name('home');

Route::get('tramites', [GuideController::class, 'index'])->name('guides.index');
Route::get('tramites/{guide:slug}', [GuideController::class, 'show'])->name('guides.show');

Route::post('tramites/{guide:slug}/correccion', [CorrectionController::class, 'store'])
    ->middleware('throttle:5,1')
    ->name('corrections.store');

require __DIR__.'/admin.php';
require __DIR__.'/settings.php';
