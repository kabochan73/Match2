<?php

namespace App\Providers;

use App\Models\Company;
use App\Models\User;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\ServiceProvider;
use Laravel\Cashier\Cashier;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        JsonResource::withoutWrapping();

        Cashier::useCustomerModel(Company::class);

        Relation::enforceMorphMap([
            'user' => User::class,
            'company' => Company::class,
        ]);

        ResetPassword::createUrlUsing(function ($notifiable, string $token) {
            $path = $notifiable instanceof Company ? 'companies/reset-password' : 'reset-password';

            return sprintf(
                '%s/%s?token=%s&email=%s',
                rtrim(config('app.frontend_url'), '/'),
                $path,
                $token,
                urlencode($notifiable->getEmailForPasswordReset()),
            );
        });
    }
}
