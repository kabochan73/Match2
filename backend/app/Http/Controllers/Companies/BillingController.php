<?php

namespace App\Http\Controllers\Companies;

use App\Enums\BillingStatus;
use App\Http\Controllers\Controller;
use App\Http\Resources\PaymentResource;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class BillingController extends Controller
{
    public function show(Request $request): array
    {
        $company = $request->user();
        $subscription = $company->subscription('default');

        return [
            'status' => match (true) {
                $subscription === null => BillingStatus::Unregistered,
                $subscription->active() => BillingStatus::Active,
                $subscription->pastDue() => BillingStatus::PastDue,
                default => BillingStatus::Unregistered,
            },
            'payments' => PaymentResource::collection(
                $company->payments()->latest('created_at')->get()
            ),
        ];
    }

    public function checkout(Request $request): array
    {
        $company = $request->user();

        if ($company->subscription('default') !== null) {
            throw ValidationException::withMessages([
                'status' => 'すでにサブスクリプションを契約済みです。支払い方法の変更は請求ポータルから行ってください。',
            ]);
        }

        $frontendUrl = rtrim(config('app.frontend_url'), '/');

        $checkout = $company->newSubscription('default', config('services.stripe.price_id'))
            ->checkout([
                'success_url' => $frontendUrl.'/companies/billing?checkout=success',
                'cancel_url' => $frontendUrl.'/companies/billing?checkout=cancel',
            ]);

        return ['url' => $checkout->asStripeCheckoutSession()->url];
    }

    public function portal(Request $request): array
    {
        $company = $request->user();
        $frontendUrl = rtrim(config('app.frontend_url'), '/');

        return ['url' => $company->billingPortalUrl($frontendUrl.'/companies/billing')];
    }
}
