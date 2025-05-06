<?php

use App\Http\Controllers\LivreurController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


// this when user go false routes , and it not auth it redirect auto to '/'
Route::get('/login', function () {
    return redirect('/');
})->name('login');



Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');



Route::middleware(['auth:admin'])->prefix('admin')->group(function () {
    Route::get('dashboard', function () {return Inertia::render('admin/dashboard'); })->name('admin.dashboard');


    // Livreur Routes
    Route::get('livreurs', [LivreurController::class, 'index'])->name('admin.livreurs');
    Route::get('livreurs/create', [LivreurController::class, 'create'])->name('admin.livreurs.create');

    Route::post('livreurs/{id}/prices', [LivreurController::class, 'updateCommunePrice'])->name('admin.livreurs.savePrices');

    Route::post('livreurs/store', [LivreurController::class, 'store'])->name('admin.livreurs.store');
    Route::get('livreurs/edit/{id}', [LivreurController::class, 'edit'])->name('admin.livreurs.edit');
    Route::put('livreurs/update/{id}', [LivreurController::class, 'update'])->name('admin.livreurs.update');
    Route::delete('livreurs/delete/{id}', [LivreurController::class, 'destroy'])->name('admin.livreurs.destroy');


    // Colis Routes
    Route::get('colis', function () { return Inertia::render('admin/colis'); })->name('admin.colis');
    Route::get('colis', [LivreurController::class, 'index'])->name('admin.colis');


});

Route::middleware(['auth:livreur'])->prefix('livreur')->group(function () {

    Route::get('dashboard', function () {return Inertia::render('livreur/dashboard'); })->name('livreur.dashboard');
    Route::get('colis', function () { return Inertia::render('livreur/colis'); })->name('livreur.colis');

});


require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
