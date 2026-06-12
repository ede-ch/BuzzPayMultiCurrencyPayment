const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: "employee" | "finance";
  country: string;
  currency_code: string;
}

export interface LoginResponse {
  user: AuthUser;
  access_token: string;
  token_type: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

export type PaymentRequestStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "expired";

export interface PaymentRequestSummary {
  id: number;
  name: string;
}

export interface PaymentRequest {
  id: number;
  status: PaymentRequestStatus;
  amount_local: string;
  currency_code: string;
  amount_eur: string;
  exchange_rate: string;
  rate_source: string;
  rate_fetched_at: string | null;
  description: string | null;
  expires_at: string | null;
  created_at: string | null;
  user: PaymentRequestSummary;
  reviewer: PaymentRequestSummary | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  country: string;
  currency_code: string;
}

export interface CreatePaymentRequestPayload {
  amount_local: number;
  currency_code: string;
  description?: string;
}

interface RequestOptions {
  method?: string;
  body?: unknown;
  token?: string;
  query?: Record<string, string | undefined>;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, token, query } = options;

  const url = new URL(`${API_URL}${path}`);
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined) url.searchParams.set(key, value);
    }
  }

  const headers: Record<string, string> = {
    Accept: "application/json",
  };
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;

  let response: Response;

  try {
    response = await fetch(url.toString(), {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw {
      message:
        "Could not connect to the server. Please check that the backend is running.",
    } satisfies ApiError;
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const data = await response.json();

  if (!response.ok) {
    throw {
      message: data.message ?? "An unexpected error occurred.",
      errors: data.errors,
    } satisfies ApiError;
  }

  return data as T;
}

export function login(email: string, password: string): Promise<LoginResponse> {
  return request<LoginResponse>("/auth/login", {
    method: "POST",
    body: { email, password },
  });
}

export function register(payload: RegisterPayload): Promise<LoginResponse> {
  return request<LoginResponse>("/auth/register", {
    method: "POST",
    body: payload,
  });
}

export function logoutRequest(token: string): Promise<void> {
  return request<void>("/auth/logout", {
    method: "POST",
    token,
  });
}

export function listPaymentRequests(
  token: string,
  status?: PaymentRequestStatus,
  page?: number
): Promise<PaginatedResponse<PaymentRequest>> {
  return request<PaginatedResponse<PaymentRequest>>("/payment-requests", {
    token,
    query: { status, page: page ? String(page) : undefined },
  });
}

export function createPaymentRequest(
  token: string,
  payload: CreatePaymentRequestPayload
): Promise<{ data: PaymentRequest }> {
  return request<{ data: PaymentRequest }>("/payment-requests", {
    method: "POST",
    token,
    body: payload,
  });
}

export function reviewPaymentRequest(
  token: string,
  id: number,
  status: "approved" | "rejected"
): Promise<{ data: PaymentRequest }> {
  return request<{ data: PaymentRequest }>(`/payment-requests/${id}`, {
    method: "PATCH",
    token,
    body: { status },
  });
}
