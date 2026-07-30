<?php

use App\Http\Controllers\Auth\Companies\AuthController as CompanyAuthController;
use App\Http\Controllers\Auth\Companies\PasswordResetController as CompanyPasswordResetController;
use App\Http\Controllers\Auth\Users\AuthController as UserAuthController;
use App\Http\Controllers\Auth\Users\PasswordResetController as UserPasswordResetController;
use App\Http\Controllers\Companies\JobPostingController as CompanyJobPostingController;
use App\Http\Controllers\Companies\ProfileController as CompanyProfileController;
use App\Http\Controllers\JobPostingController;
use App\Http\Controllers\Users\CertificationController;
use App\Http\Controllers\Users\EducationController;
use App\Http\Controllers\Users\ProfileController as UserProfileController;
use App\Http\Controllers\Users\WorkExperienceController;
use Illuminate\Support\Facades\Route;

Route::get('job-postings', [JobPostingController::class, 'index'])->name('job-postings.index');
Route::get('job-postings/{jobPosting}', [JobPostingController::class, 'show'])->name('job-postings.show');

Route::prefix('users')->name('users.')->group(function () {
    Route::post('register', [UserAuthController::class, 'register'])->name('register');
    Route::post('login', [UserAuthController::class, 'login'])->name('login');
    Route::post('forgot-password', [UserPasswordResetController::class, 'forgotPassword'])->name('password.forgot');
    Route::post('reset-password', [UserPasswordResetController::class, 'reset'])->name('password.reset');

    Route::middleware('auth:web')->group(function () {
        Route::post('logout', [UserAuthController::class, 'logout'])->name('logout');
        Route::get('me', [UserAuthController::class, 'me'])->name('me');

        Route::get('profile', [UserProfileController::class, 'show'])->name('profile.show');
        Route::put('profile', [UserProfileController::class, 'update'])->name('profile.update');

        Route::apiResource('work-experiences', WorkExperienceController::class)
            ->parameters(['work-experiences' => 'workExperience'])
            ->only(['index', 'store', 'update', 'destroy']);
        Route::apiResource('educations', EducationController::class)
            ->only(['index', 'store', 'update', 'destroy']);
        Route::apiResource('certifications', CertificationController::class)
            ->only(['index', 'store', 'update', 'destroy']);
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

        Route::get('profile', [CompanyProfileController::class, 'show'])->name('profile.show');
        Route::put('profile', [CompanyProfileController::class, 'update'])->name('profile.update');

        Route::apiResource('job-postings', CompanyJobPostingController::class)
            ->parameters(['job-postings' => 'jobPosting']);
        Route::patch('job-postings/{jobPosting}/publish', [CompanyJobPostingController::class, 'publish'])->name('job-postings.publish');
        Route::patch('job-postings/{jobPosting}/close', [CompanyJobPostingController::class, 'close'])->name('job-postings.close');
    });
});
