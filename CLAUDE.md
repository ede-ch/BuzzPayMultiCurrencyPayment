# CLAUDE.md — Multi-Currency Payment API (Buzzvel 2026)

## Project Overview

Laravel 12 REST API for managing multi-currency payment requests across a company
with employees in different countries. Authenticated users submit payments in local
currency; finance team approves or rejects them.

**Stack:** Laravel 12, PHP 8.2+, MySQL, Laravel Sanctum, exchangerate-api.com

---

## Architecture

```
app/
├── Http/
│   ├── Controllers/Api/
│   │   ├── AuthController.php
│   │   └── PaymentRequestController.php
│   ├── Requests/
│   │   ├── StorePaymentRequestRequest.php
│   │   └── UpdatePaymentRequestRequest.php
│   └── Resources/
│       └── PaymentRequestResource.php
├── Models/
│   ├── User.php
│   └── PaymentRequest.php
├── Services/
│   ├── ExchangeRateService.php
│   └── PaymentRequestService.php
├── Policies/
│   └── PaymentRequestPolicy.php
└── Exceptions/
    └── ExchangeRateUnavailableException.php

routes/
└── api.php

routes/console.php   ← scheduled task registration (Laravel 12)

tests/
├── Feature/
│   ├── AuthTest.php
│   ├── PaymentRequestTest.php
│   └── ExpirationTest.php
└── Unit/
    └── ExchangeRateServiceTest.php
```

**Rule:** Controllers orchestrate only. Business logic lives in Services.
Form Requests validate. Policies handle authorization.

---

## Database Schema

### users
```
id
name
email (unique)
password
role          ENUM('employee', 'finance')  default: employee
country       string
currency_code CHAR(3)   — ISO 4217, employee's local currency
email_verified_at
remember_token
timestamps
```

### payment_requests
```
id
user_id           FK → users (who submitted)
amount_local      DECIMAL(15,2)   — original amount in local currency
currency_code     CHAR(3)         — ISO 4217 (BRL, USD, GBP, etc.)
amount_eur        DECIMAL(15,2)   — converted at creation time, NEVER changes
exchange_rate     DECIMAL(15,6)   — rate used at creation
rate_source       STRING          — 'exchangerate-api.com'
rate_fetched_at   TIMESTAMP       — when the rate was fetched
status            ENUM('pending','approved','rejected','expired')  default: pending
reviewed_by       FK → users nullable
reviewed_at       TIMESTAMP nullable
expires_at        TIMESTAMP       — created_at + 48 hours
description       STRING nullable
timestamps
```

---

## Critical Business Rules

### 1. Exchange rate is IMMUTABLE
- Rate is fetched ONLY at creation time (POST).
- Never re-fetch on approve/reject/read.
- Store `exchange_rate`, `rate_source`, and `rate_fetched_at` alongside the record.
- `amount_eur` = `amount_local / exchange_rate` (EUR is base).

### 2. Role-based access
- `employee` — can create requests, view own requests.
- `finance` — can list all requests, approve or reject pending ones.
- Enforce via **Policy**, not ad-hoc `if` checks in controllers.

### 3. Status transitions
```
pending → approved   (finance only)
pending → rejected   (finance only)
pending → expired    (scheduled command only, after 48h)
```
Any other transition must return 422 with a clear message.
A request that is not `pending` cannot be approved or rejected.

### 4. Expiration
- `expires_at` is set to `created_at + 48 hours` on creation.
- Scheduled command runs hourly and sets `status = expired` where
  `status = pending AND expires_at <= now()`.
- Document in README how to run: `php artisan schedule:run` or
  `php artisan payments:expire-pending` directly.

### 5. Validation rules
- `amount_local` — required, numeric, min:0.01
- `currency_code` — required, string, size:3, must be a valid ISO 4217 code
- `description` — optional, string, max:255
- On update (approve/reject): `status` must be `pending`, user must have `finance` role.

---

## API Endpoints

```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout          (auth required)

GET    /api/payment-requests     (auth required — finance sees all, employee sees own)
POST   /api/payment-requests     (auth required — any authenticated user)
GET    /api/payment-requests/{id}(auth required — owner or finance)
PATCH  /api/payment-requests/{id}(auth required — finance only)
```

### Query params for GET /api/payment-requests
- `?status=pending|approved|rejected|expired`

### PATCH body
```json
{ "status": "approved" }
{ "status": "rejected" }
```

---

## ExchangeRateService Contract

```php
// app/Services/ExchangeRateService.php

public function getRate(string $toCurrency): array
// Returns:
[
    'rate'       => float,   // how many toCurrency units = 1 EUR
    'source'     => string,  // 'exchangerate-api.com'
    'fetched_at' => Carbon,
]
// Throws ExchangeRateUnavailableException on HTTP failure or missing currency.
```

Use Laravel's `Http::` facade so tests can use `Http::fake()`.
Register the service in `AppServiceProvider` for dependency injection.

---

## Response Format

Always return JSON. Use **API Resources** (`PaymentRequestResource`).

### Success (201 on create, 200 otherwise)
```json
{
  "data": {
    "id": 1,
    "status": "pending",
    "amount_local": 500.00,
    "currency_code": "BRL",
    "amount_eur": 92.05,
    "exchange_rate": 5.431200,
    "rate_source": "exchangerate-api.com",
    "rate_fetched_at": "2026-06-08T14:30:00Z",
    "expires_at": "2026-06-10T14:30:00Z",
    "created_at": "2026-06-08T14:30:00Z"
  }
}
```

### Error
```json
{
  "message": "Human-readable error",
  "errors": { "field": ["Validation message"] }   // only on 422
}
```

### HTTP Status Codes
- `200` — OK
- `201` — Created
- `401` — Unauthenticated
- `403` — Forbidden (wrong role)
- `404` — Not found
- `422` — Validation error or invalid state transition
- `503` — Exchange rate API unavailable

---

## Seeders

Seed at least 5 employees across different countries and currencies, plus 1 finance user.

```php
// Suggested employees:
['name' => 'Alice Ferreira',  'country' => 'Brazil',        'currency_code' => 'BRL']
['name' => 'João Martins',    'country' => 'Portugal',      'currency_code' => 'EUR']  // edge case: already EUR
['name' => 'Sarah Connor',    'country' => 'United States', 'currency_code' => 'USD']
['name' => 'Yuki Tanaka',     'country' => 'Japan',         'currency_code' => 'JPY']
['name' => 'Lena Müller',     'country' => 'Germany',       'currency_code' => 'EUR']
['name' => 'Carlos Romero',   'country' => 'Mexico',        'currency_code' => 'MXN']

// Finance user:
['name' => 'Finance Admin',   'role' => 'finance', 'currency_code' => 'EUR']
```

Note the EUR edge case (João/Lena): rate should be 1.0, amount_eur = amount_local.
Handle this gracefully in ExchangeRateService or PaymentRequestService.

---

## Testing Strategy

### Unit — ExchangeRateServiceTest
- `Http::fake()` with a mock response → assert rate, source, fetched_at returned correctly.
- `Http::fake()` with a 500 response → assert `ExchangeRateUnavailableException` thrown.
- Missing currency in response → assert exception thrown.

### Feature — AuthTest
- Register with valid data → 201.
- Register with duplicate email → 422.
- Login with correct credentials → 200 + token.
- Login with wrong password → 401.
- Logout → 200, token invalidated.

### Feature — PaymentRequestTest
- Create with valid data → 201, assert `amount_eur` and `exchange_rate` stored.
- Create with invalid currency → 422.
- Create with negative amount → 422.
- Employee cannot approve → 403.
- Finance can approve pending → 200, status changes.
- Finance cannot approve already-approved → 422.
- Employee can only see own requests.
- Finance can see all requests.
- Filter by status works.

### Feature — ExpirationTest
- Run command with a request older than 48h → status becomes `expired`.
- Run command with a request under 48h → status unchanged.

---

## Common Pitfalls to Avoid

1. **Do NOT re-fetch exchange rate on approve/reject.** Rate is locked at creation.

2. **Do NOT skip the Policy.** Use `$this->authorize()` in the controller.
   Ad-hoc role checks (`if $user->role === 'finance'`) in controllers will lose points.

3. **Do NOT forget `expires_at`.** Set it in `PaymentRequestService::create()`,
   not in the controller or model boot.

4. **Do NOT return the raw Eloquent model.** Always use `PaymentRequestResource`.

5. **Do NOT hardcode the exchange rate URL.** Put it in `config/services.php`:
   ```php
   'exchangerate' => [
       'url' => env('EXCHANGE_RATE_API_URL', 'https://api.exchangerate-api.com/v4/latest'),
   ]
   ```

6. **Do NOT forget the EUR edge case.** If `currency_code === 'EUR'`, skip the API call,
   set `exchange_rate = 1.0`, `amount_eur = amount_local`.

7. **Do NOT let the scheduled command fail silently.** Wrap in try/catch and log errors.

8. **README is mandatory.** Without it the submission is ignored.

---

## README Checklist (must cover)

- [ ] Requirements (PHP version, Composer, MySQL)
- [ ] Installation steps (`composer install`, `.env` setup, `php artisan migrate --seed`)
- [ ] How to run tests (`php artisan test`)
- [ ] How to run the scheduler (`php artisan payments:expire-pending`)
- [ ] API endpoint list with example requests/responses
- [ ] Seeded credentials (email + password for employee and finance users)
- [ ] Video or public URL showing the project working

---

## Implementation Order

1. `composer create-project laravel/laravel` + Sanctum install
2. Migrations (users + payment_requests)
3. Models with relationships and casts
4. Seeders (6 users + sample payment requests)
5. `ExchangeRateService` + Unit test
6. Auth endpoints (register/login/logout) + AuthTest
7. `PaymentRequestService::create()` + `StorePaymentRequestRequest`
8. `PaymentRequestPolicy`
9. Full CRUD controller + `PaymentRequestResource`
10. Feature tests for payment requests
11. `ExpirePaymentRequests` command + schedule registration + ExpirationTest
12. Error handling (`Handler.php` — render ExchangeRateUnavailableException as 503)
13. README
14. Final review: run `php artisan test`, check all green
