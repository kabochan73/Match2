import { apiClientFetch } from "@/lib/api/client";
import type { Billing } from "@/lib/api/types";

export const BILLING_STATUS_LABELS = {
  unregistered: "未契約",
  active: "課金中",
  past_due: "未払いで非公開",
} as const;

export const PAYMENT_STATUS_LABELS = {
  paid: "支払い済み",
  failed: "失敗",
  pending: "処理中",
} as const;

export const companyBillingQueryKey = ["companies", "billing"] as const;

export function fetchCompanyBilling(): Promise<Billing> {
  return apiClientFetch<Billing>("/api/companies/billing");
}

export const companyBillingQueryOptions = {
  queryKey: companyBillingQueryKey,
  queryFn: fetchCompanyBilling,
};

export async function startCompanyBillingCheckout(): Promise<string> {
  const { url } = await apiClientFetch<{ url: string }>("/api/companies/billing/checkout", {
    method: "POST",
  });
  return url;
}

export async function openCompanyBillingPortal(): Promise<string> {
  const { url } = await apiClientFetch<{ url: string }>("/api/companies/billing/portal", {
    method: "POST",
  });
  return url;
}
