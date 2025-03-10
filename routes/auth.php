<?php
use Illuminate\Support\Facades\Route;

// admin controllers
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\ConfirmablePasswordController;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;
use App\Http\Controllers\Auth\EmailVerificationPromptController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
// use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\VerifyEmailController;




// livreur controllers
use App\Http\Controllers\Auth\Livreur\AuthenticatedSessionController as LivreurAuthenticatedSessionController ;
use App\Http\Controllers\Auth\Livreur\PasswordResetLinkController as LivreurPasswordResetLinkController ;
use App\Http\Controllers\Auth\Livreur\NewPasswordController as LivreurNewPasswordController;




// =============== admins routes ===============
Route::middleware('guest')->prefix('admin')->group(function () {
    // Route::get('register', [RegisteredUserController::class, 'create'])->name('admin.register');
    // Route::post('register', [RegisteredUserController::class, 'store']);

    Route::get('login', [AuthenticatedSessionController::class, 'create'])->name('admin.login');
    Route::post('login', [AuthenticatedSessionController::class, 'store']);
    Route::get('forgot-password', [PasswordResetLinkController::class, 'create'])->name('password.request');
    Route::post('forgot-password', [PasswordResetLinkController::class, 'store'])
        ->name('admin.password.email');
    Route::get('reset-password/{token}', [NewPasswordController::class, 'create'])->name('admin.password.reset');
    Route::post('reset-password', [NewPasswordController::class, 'store'])->name(name: 'admin.password.store');
});

Route::middleware('auth:admin')->prefix('admin')->group(function () {
    Route::get('verify-email', EmailVerificationPromptController::class)
        ->name('verification.notice');

    Route::get('verify-email/{id}/{hash}', VerifyEmailController::class)
        ->middleware(['signed', 'throttle:6,1'])
        ->name('verification.verify');

    Route::post('email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
        ->middleware('throttle:6,1')
        ->name('verification.send');

    Route::get('confirm-password', [ConfirmablePasswordController::class, 'show'])
        ->name('password.confirm');

    Route::post('confirm-password', [ConfirmablePasswordController::class, 'store']);

    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])
        ->name('admin.logout');
});
// =============== admins routes ===============



// =============== Livreur routes ===============
Route::middleware('guest')->prefix('livreur')->group(function () {
    // Route::get('register', [RegisteredUserController::class, 'create'])->name('register');
    // Route::post('register', [RegisteredUserController::class, 'store']);

    Route::get('login', [LivreurAuthenticatedSessionController::class, 'create'])->name('livreur.login');
    Route::post('login', [LivreurAuthenticatedSessionController::class, 'store']);
    Route::get('forgot-password', [LivreurPasswordResetLinkController::class, 'create'])->name('livreur.password.request');
    Route::post('forgot-password', action: [LivreurPasswordResetLinkController::class, 'store'])
        ->name('livreur.password.email');
    Route::get('reset-password/{token}', [LivreurNewPasswordController::class, 'create'])->name(name: 'livreur.password.reset');
    Route::post('reset-password', [LivreurNewPasswordController::class, 'store'])->name('livreur.password.store');
});

Route::middleware('auth:livreur')->prefix('livreur')->group(function () {
    // Route::get('verify-email', EmailVerificationPromptController::class)
    //     ->name('verification.notice');

    // Route::get('verify-email/{id}/{hash}', VerifyEmailController::class)
    //     ->middleware(['signed', 'throttle:6,1'])
    //     ->name('verification.verify');

    // Route::post('email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
    //     ->middleware('throttle:6,1')
    //     ->name('verification.send');

    // Route::get('confirm-password', [ConfirmablePasswordController::class, 'show'])
    //     ->name('password.confirm');

    // Route::post('confirm-password', [ConfirmablePasswordController::class, 'store']);

    Route::post('logout', [LivreurAuthenticatedSessionController::class, 'destroy'])
        ->name('livreur.logout');
});
// =============== Livreur routes ===============







