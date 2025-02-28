<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth'])->prefix('admin')->group(function () {
    Route::get('dashboard', function () {return Inertia::render('dashboard'); })->name('dashboard');
    Route::get('colis', function () { return Inertia::render('colis'); })->name('colis');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
