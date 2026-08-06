"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  BILLING_STATUS_LABELS,
  PAYMENT_STATUS_LABELS,
  companyBillingQueryOptions,
  openCompanyBillingPortal,
  startCompanyBillingCheckout,
} from "@/lib/company/billing/api";
import { getErrorMessage } from "@/lib/api/validation";

function formatYen(amount: number): string {
  return `¥${amount.toLocaleString("ja-JP")}`;
}

function formatDateTime(value: string): string {
  return new Date(value).toLocaleString("ja-JP");
}

export function BillingView() {
  const { data: billing } = useQuery(companyBillingQueryOptions);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!billing) return null;

  const handleCheckout = async () => {
    setError(null);
    setIsRedirecting(true);
    try {
      window.location.href = await startCompanyBillingCheckout();
    } catch (err) {
      setError(getErrorMessage(err));
      setIsRedirecting(false);
    }
  };

  const handlePortal = async () => {
    setError(null);
    setIsRedirecting(true);
    try {
      window.location.href = await openCompanyBillingPortal();
    } catch (err) {
      setError(getErrorMessage(err));
      setIsRedirecting(false);
    }
  };

  return (
    <main className="flex w-full flex-1 flex-col items-center gap-6 py-8">
      <div className="flex w-full max-w-2xl items-center justify-between">
        <h1 className="text-2xl font-semibold">お支払い</h1>
      </div>

      <div className="flex w-full max-w-2xl flex-col gap-4">
        <div className="flex items-center justify-between rounded border p-4">
          <div className="flex flex-col gap-1">
            <span className="text-sm text-gray-500">ステータス</span>
            <span className="font-medium">{BILLING_STATUS_LABELS[billing.status]}</span>
          </div>

          {billing.status === "unregistered" ? (
            <button
              type="button"
              onClick={handleCheckout}
              disabled={isRedirecting}
              className="rounded bg-black px-4 py-2 text-sm text-white disabled:opacity-50"
            >
              支払い方法を登録する
            </button>
          ) : (
            <button
              type="button"
              onClick={handlePortal}
              disabled={isRedirecting}
              className="rounded border px-4 py-2 text-sm disabled:opacity-50"
            >
              支払い方法を管理する
            </button>
          )}
        </div>

        {billing.status === "past_due" && (
          <p className="text-sm text-red-600">
            決済に失敗したため、公開中の求人はすべて非公開になっています。支払い方法を更新すると、求人を再公開できるようになります。
          </p>
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}

        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-medium">請求履歴</h2>
          {billing.payments.length > 0 ? (
            <ul className="flex flex-col gap-2">
              {billing.payments.map((payment) => (
                <li
                  key={payment.id}
                  className="flex items-center justify-between rounded border p-4 text-sm"
                >
                  <span className="text-gray-600">{formatDateTime(payment.created_at)}</span>
                  <span>{formatYen(payment.amount)}</span>
                  <span className="text-gray-600">{PAYMENT_STATUS_LABELS[payment.status]}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">請求履歴はありません</p>
          )}
        </section>
      </div>
    </main>
  );
}
