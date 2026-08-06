<?php

use App\Enums\JobPostingStatus;
use App\Enums\PaymentStatus;
use App\Models\Company;
use App\Models\JobPosting;
use App\Models\Payment;

it('records a payment when an invoice payment succeeds', function () {
    $company = Company::factory()->create(['stripe_id' => 'cus_123']);

    $this->postJson('/api/webhooks/stripe', [
        'type' => 'invoice.payment_succeeded',
        'data' => [
            'object' => [
                'id' => 'in_success_123',
                'customer' => 'cus_123',
                'amount_paid' => 1000,
                'parent' => ['subscription_details' => ['subscription' => null]],
            ],
        ],
    ])->assertOk();

    $payment = Payment::where('stripe_invoice_id', 'in_success_123')->first();

    expect($payment)->not->toBeNull();
    expect($payment->company_id)->toBe($company->id);
    expect($payment->amount)->toBe(1000);
    expect($payment->status)->toBe(PaymentStatus::Paid);
    expect($payment->paid_at)->not->toBeNull();
});

it('records a failed payment and unpublishes the company\'s job postings when an invoice payment fails', function () {
    $company = Company::factory()->create(['stripe_id' => 'cus_456']);
    $published = JobPosting::factory()->for($company)->published()->create();
    $draft = JobPosting::factory()->for($company)->create();

    $this->postJson('/api/webhooks/stripe', [
        'type' => 'invoice.payment_failed',
        'data' => [
            'object' => [
                'id' => 'in_failed_123',
                'customer' => 'cus_456',
                'amount_due' => 1000,
            ],
        ],
    ])->assertOk();

    $payment = Payment::where('stripe_invoice_id', 'in_failed_123')->first();

    expect($payment)->not->toBeNull();
    expect($payment->status)->toBe(PaymentStatus::Failed);
    expect($payment->paid_at)->toBeNull();

    expect($published->fresh()->status)->toBe(JobPostingStatus::Unpublished);
    expect($draft->fresh()->status)->toBe(JobPostingStatus::Draft);
});

it('ignores webhooks for an unknown stripe customer', function () {
    $this->postJson('/api/webhooks/stripe', [
        'type' => 'invoice.payment_failed',
        'data' => [
            'object' => [
                'id' => 'in_unknown_123',
                'customer' => 'cus_unknown',
                'amount_due' => 1000,
            ],
        ],
    ])->assertOk();

    expect(Payment::where('stripe_invoice_id', 'in_unknown_123')->exists())->toBeFalse();
});
