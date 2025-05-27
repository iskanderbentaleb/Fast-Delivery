<?php

use App\Http\Controllers\ColieController;
use App\Http\Controllers\ColieHistoryController;
use App\Http\Controllers\LivreurController;
use App\Http\Controllers\PaymentController;
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

    // Colies Routes
    Route::get('colis', [ColieController::class, 'index'])->name('admin.colies');
    Route::get('colis/create', [ColieController::class, 'create'])->name('admin.colies.create');
    Route::post('colis/store', [ColieController::class, 'store'])->name('admin.colies.store');
    Route::delete('colis/{colie}', [ColieController::class, 'destroy'])->name('admin.colies.destroy');
    Route::get('colis/edit/{colie}', [ColieController::class, 'edit'])->name('admin.colies.edit');
    Route::put('colis/colies/{colie}', [ColieController::class, 'update'])->name('admin.colies.update');
    Route::get('colis/{colie}/bordereau', [ColieController::class, 'generateBordereau'])->name('admin.colies.bordereau');
    Route::get('colis/bordereaux', [ColieController::class, 'generateMultipleBordereaux'])->name('admin.colies.bordereaux');
    Route::get('colis/export', [ColieController::class, 'export'])->name('admin.colies.export');
    Route::get('colis/status-history/{tracking}', [ColieHistoryController::class, 'getStatusHistory'])->name('admin.colies.status-history');
    Route::post('colis/colies/check', [ColieHistoryController::class, 'checkColieExist'])->name('admin.colie.check-exist');
    Route::post('colis/colie-histories', [ColieHistoryController::class, 'store'])->name('admin.colies.colie-histories.store');


    // facture Routes
    Route::get('payments', [PaymentController::class, 'index'])->name(name: 'admin.payments');
    Route::get('payments/create', [PaymentController::class, 'create'])->name('admin.payments.create');
    Route::get('payments/calculate/{livreur}', [PaymentController::class, 'calculate'])->name('admin.payments.calculate');
    Route::post('payments/store', [PaymentController::class, 'store'])->name('admin.payments.store');
    Route::delete('payments/{payment_id}', [PaymentController::class, 'destroy'])->name('admin.payments.destroy');


});

Route::middleware(['auth:livreur'])->prefix('livreur')->group(function () {

    Route::get('dashboard', function () {return Inertia::render('livreur/dashboard'); })->name('livreur.dashboard');
    Route::get('colis', function () { return Inertia::render('livreur/colis'); })->name('livreur.colis');

});


require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
