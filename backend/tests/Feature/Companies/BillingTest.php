<?php

use App\Enums\BillingStatus;
use App\Enums\PaymentStatus;
use App\Models\Company;
use App\Models\Payment;

it('reports unregistered status when the company has no subscription', function () {
    $company = Company::factory()->create();

    $this->actingAs($company, 'companies')
        ->getJson('/api/companies/billing')
        ->assertOk()
        ->assertJsonPath('status', BillingStatus::Unregistered->value)
        ->assertJsonPath('payments', []);
});

it('reports active status for an active subscription', function () {
    $company = Company::factory()->create();
    $company->subscriptions()->create([
        'type' => 'default',
        'stripe_id' => 'sub_active_123',
        'stripe_status' => 'active',
        'stripe_price' => 'price_123',
        'quantity' => 1,
    ]);

    $this->actingAs($company, 'companies')
        ->getJson('/api/companies/billing')
        ->assertOk()
        ->assertJsonPath('status', BillingStatus::Active->value);
});

it('reports past_due status for a past due subscription', function () {
    $company = Company::factory()->create();
    $company->subscriptions()->create([
        'type' => 'default',
        'stripe_id' => 'sub_past_due_123',
        'stripe_status' => 'past_due',
        'stripe_price' => 'price_123',
        'quantity' => 1,
    ]);

    $this->actingAs($company, 'companies')
        ->getJson('/api/companies/billing')
        ->assertOk()
        ->assertJsonPath('status', BillingStatus::PastDue->value);
});

it('lists the company\'s payment history', function () {
    $company = Company::factory()->create();
    $other = Company::factory()->create();

    Payment::create([
        'company_id' => $company->id,
        'stripe_invoice_id' => 'in_own',
        'amount' => 1000,
        'status' => PaymentStatus::Paid,
        'paid_at' => now(),
    ]);
    Payment::create([
        'company_id' => $other->id,
        'stripe_invoice_id' => 'in_other',
        'amount' => 1000,
        'status' => PaymentStatus::Paid,
        'paid_at' => now(),
    ]);

    $response = $this->actingAs($company, 'companies')
        ->getJson('/api/companies/billing')
        ->assertOk();

    $payments = $response->json('payments');

    expect($payments)->toHaveCount(1);
    expect($payments[0]['amount'])->toBe(1000);
    expect(array_key_exists('stripe_invoice_id', $payments[0]))->toBeFalse();
});

it('rejects starting checkout when already subscribed', function () {
    $company = Company::factory()->create();
    $company->subscriptions()->create([
        'type' => 'default',
        'stripe_id' => 'sub_existing_123',
        'stripe_status' => 'active',
        'stripe_price' => 'price_123',
        'quantity' => 1,
    ]);

    $this->actingAs($company, 'companies')
        ->postJson('/api/companies/billing/checkout')
        ->assertUnprocessable()
        ->assertJsonValidationErrors('status');
});
