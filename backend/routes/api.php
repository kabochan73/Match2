<?php

use App\Http\Controllers\Auth\Companies\AuthController as CompanyAuthController;
use App\Http\Controllers\Auth\Companies\PasswordResetController as CompanyPasswordResetController;
use App\Http\Controllers\Auth\Users\AuthController as UserAuthController;
use App\Http\Controllers\Auth\Users\PasswordResetController as UserPasswordResetController;
use App\Http\Controllers\Companies\BillingController as CompanyBillingController;
use App\Http\Controllers\Companies\JobPostingController as CompanyJobPostingController;
use App\Http\Controllers\Companies\LikeController as CompanyLikeController;
use App\Http\Controllers\Companies\MessageController as CompanyMessageController;
use App\Http\Controllers\Companies\NotificationController as CompanyNotificationController;
use App\Http\Controllers\Companies\ProfileController as CompanyProfileController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\JobPostingController;
use App\Http\Controllers\StripeWebhookController;
use App\Http\Controllers\Users\CertificationController;
use App\Http\Controllers\Users\EducationController;
use App\Http\Controllers\Users\LikeController as UserLikeController;
use App\Http\Controllers\Users\MessageController as UserMessageController;
use App\Http\Controllers\Users\NotificationController as UserNotificationController;
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

        Route::get('likes/remaining', [UserLikeController::class, 'remaining'])->name('likes.remaining');
        Route::apiResource('likes', UserLikeController::class)
            ->only(['index', 'show', 'store']);

        Route::get('likes/{like}/messages', [UserMessageController::class, 'index'])->name('likes.messages.index');
        Route::post('likes/{like}/messages', [UserMessageController::class, 'store'])->name('likes.messages.store');

        Route::get('notifications', [UserNotificationController::class, 'index'])->name('notifications.index');
        Route::patch('notifications/{notification}/read', [UserNotificationController::class, 'markAsRead'])->name('notifications.read');
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

        Route::apiResource('likes', CompanyLikeController::class)
            ->only(['index', 'show']);
        Route::patch('likes/{like}/match', [CompanyLikeController::class, 'match'])->name('likes.match');

        Route::get('likes/{like}/messages', [CompanyMessageController::class, 'index'])->name('likes.messages.index');
        Route::post('likes/{like}/messages', [CompanyMessageController::class, 'store'])->name('likes.messages.store');

        Route::get('notifications', [CompanyNotificationController::class, 'index'])->name('notifications.index');
        Route::patch('notifications/{notification}/read', [CompanyNotificationController::class, 'markAsRead'])->name('notifications.read');

        Route::get('billing', [CompanyBillingController::class, 'show'])->name('billing.show');
        Route::post('billing/checkout', [CompanyBillingController::class, 'checkout'])->name('billing.checkout');
        Route::post('billing/portal', [CompanyBillingController::class, 'portal'])->name('billing.portal');
    });
});

Route::post('webhooks/stripe', [StripeWebhookController::class, 'handleWebhook'])->name('webhooks.stripe');

Route::get('companies/{company}', [CompanyController::class, 'show'])->name('companies.show');
