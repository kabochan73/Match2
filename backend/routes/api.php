<?php

use App\Http\Controllers\Auth\Companies\AuthController as CompanyAuthController;
use App\Http\Controllers\Auth\Companies\PasswordResetController as CompanyPasswordResetController;
use App\Http\Controllers\Auth\Users\AuthController as UserAuthController;
use App\Http\Controllers\Auth\Users\PasswordResetController as UserPasswordResetController;
use Illuminate\Support\Facades\Route;

Route::prefix('users')->name('users.')->group(function () {
    Route::post('register', [UserAuthController::class, 'register'])->name('register');
    Route::post('login', [UserAuthController::class, 'login'])->name('login');
    Route::post('forgot-password', [UserPasswordResetController::class, 'forgotPassword'])->name('password.forgot');
    Route::post('reset-password', [UserPasswordResetController::class, 'reset'])->name('password.reset');

    Route::middleware('auth:web')->group(function () {
        Route::post('logout', [UserAuthController::class, 'logout'])->name('logout');
        Route::get('me', [UserAuthController::class, 'me'])->name('me');
    });
});

Route::prefix('companies')->name('companies.')->group(function () {
    Route::post('register', [CompanyAuthController::class, 'register'])->name('register');
    Route::post('login', [CompanyAuthController::class, 'login'])->name('login');
    Route::post('forgot-password', [CompanyPasswordResetController::class, 'forgotPassword'])->name('password.forgot');
    Route::post('reset-password', [CompanyPasswordResetController::class, 'reset'])->name('password.reset');

    Route::middleware('auth:companies')->group(function () {
        Route::post('logout', [CompanyAuthController::class, 'logout'])->name('logout');
        Route::get('me', [CompanyAuthController::class, 'me'])->name('me');
    });
});
