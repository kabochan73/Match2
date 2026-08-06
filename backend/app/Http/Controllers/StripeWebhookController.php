<?php

namespace App\Http\Controllers;

use App\Enums\PaymentStatus;
use App\Models\Payment;
use App\Services\JobPostingService;
use Illuminate\Support\Carbon;
use Laravel\Cashier\Http\Controllers\WebhookController as CashierWebhookController;
use Symfony\Component\HttpFoundation\Response;

class StripeWebhookController extends CashierWebhookController
{
    public function __construct(private JobPostingService $jobPostingService)
    {
        parent::__construct();
    }

    protected function handleInvoicePaymentSucceeded(array $payload): Response
    {
        $response = parent::handleInvoicePaymentSucceeded($payload);

        $this->recordPayment($payload, PaymentStatus::Paid);

        return $response;
    }

    protected function handleInvoicePaymentFailed(array $payload): Response
    {
        $this->recordPayment($payload, PaymentStatus::Failed);

        if ($company = $this->getUserByStripeId($payload['data']['object']['customer'] ?? null)) {
            $this->jobPostingService->unpublishAllForCompany($company);
        }

        return $this->successMethod();
    }

    /**
     * @param  array<string, mixed>  $payload
     */
    private function recordPayment(array $payload, PaymentStatus $status): void
    {
        $invoice = $payload['data']['object'];

        $company = $this->getUserByStripeId($invoice['customer'] ?? null);

        if (! $company) {
            return;
        }

        Payment::updateOrCreate(
            ['stripe_invoice_id' => $invoice['id']],
            [
                'company_id' => $company->id,
                'amount' => $invoice['amount_paid'] ?? $invoice['amount_due'] ?? 0,
                'status' => $status,
                'paid_at' => $status === PaymentStatus::Paid ? Carbon::now() : null,
            ]
        );
    }
}
