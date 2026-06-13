# BuzzvelMultiCurrencyPayment

A REST API built with Laravel 12 for managing multi-currency payment requests. Employees submit payments in their local currency; the system fetches real-time exchange rates and routes requests to the finance team for approval.

## Demo / Project Video

> ⚠️ TODO: substituir por um link real do vídeo/demo antes da entrega (2026-06-13).

## Requirements

- PHP 8.2+
- Composer
- MySQL 8+ (or SQLite for local dev/testing)
- Extensions: `pdo_mysql`, `mbstring`, `openssl`

## Setup

```bash
# 1. Clone the repository
git clone https://github.com/ede-ch/BuzzvelMultiCurrencyPayment.git
cd BuzzvelMultiCurrencyPayment

# 2. Install dependencies
composer install

# 3. Configure environment
cp .env.example .env
php artisan key:generate

# 4. Edit .env with your database credentials and API URL
#    DB_CONNECTION=mysql
#    DB_HOST=127.0.0.1
#    DB_PORT=3306
#    DB_DATABASE=buzzvel_payment
#    DB_USERNAME=root
#    DB_PASSWORD=
#    EXCHANGE_RATE_API_URL=https://api.exchangerate-api.com/v4/latest

# 5. Run migrations and seed the database
php artisan migrate --seed

# 6. Start the server
php artisan serve
```

The API will be available at `http://localhost:8000/api`.

## Running Tests

```bash
php artisan test
```

Tests use an SQLite in-memory database — no additional configuration required.

## Scheduled Task

To run the scheduler locally (expires pending requests older than 48h every hour):

```bash
php artisan schedule:work
```

Or run the command directly:

```bash
php artisan payments:expire-pending
```

## Caching

Exchange rates fetched from the external API (`exchangerate-api.com`) are cached
per target currency for `EXCHANGE_RATE_CACHE_TTL` seconds (default: `3600`, i.e.
1 hour), using Laravel's cache (`database` driver in dev/prod, `array` driver in
tests). This avoids hitting the external API on every payment request creation
for currencies that have already been looked up recently.

The `rate_fetched_at` value stored on each payment request reflects the moment
the rate was **originally fetched from the source**, not the moment the payment
request was created. So if a rate is served from cache, `rate_fetched_at` still
tells you how stale that rate is relative to the source — which is the whole
point of an audit/provenance field.

Configure the TTL via `.env`:

```
EXCHANGE_RATE_CACHE_TTL=3600
```

## API Documentation

Interactive API documentation is generated with [Scribe](https://scribe.knuckles.wtf/laravel)
as a static page, including request/response examples, authentication details,
and an OpenAPI spec.

- Open `public/docs/index.html` directly in a browser, or
- Start `php artisan serve` and visit `http://localhost:8000/docs`

A Postman collection (`public/docs/collection.json`) and OpenAPI spec
(`public/docs/openapi.yaml`) are also generated alongside the HTML docs.

The generated docs are committed to the repository, so they're available
out-of-the-box. To regenerate after changing endpoint annotations (in
`AuthController` / `PaymentRequestController`):

```bash
php artisan scribe:generate
```

## Continuous Integration

Every push and pull request to `main` runs via GitHub Actions
(`.github/workflows/ci.yml`):

1. Code style check — `composer lint` (Laravel Pint, check mode)
2. Test suite — `composer test` (SQLite in-memory database)

Run the same checks locally before pushing:

```bash
composer lint
composer test
```

## API Reference

> For interactive documentation with request/response examples for every
> endpoint, see [API Documentation](#api-documentation). The summary below is
> a quick reference.

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login — returns Bearer token |
| POST | `/api/auth/logout` | Revoke token (requires auth) |

**Register request body:**
```json
{
  "name": "Alice Ferreira",
  "email": "alice@example.com",
  "password": "password",
  "password_confirmation": "password",
  "country": "Brazil",
  "currency_code": "BRL"
}
```

**Login request body:**
```json
{
  "email": "alice@example.com",
  "password": "password"
}
```

**Auth response:**
```json
{
  "user": { "id": 1, "name": "Alice Ferreira", "email": "alice@example.com", "role": "employee", "country": "Brazil", "currency_code": "BRL" },
  "access_token": "1|abc...",
  "token_type": "Bearer"
}
```

### Payment Requests

All endpoints require `Authorization: Bearer {token}` header.

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| POST | `/api/payment-requests` | any | Create a payment request |
| GET | `/api/payment-requests` | any | List requests (`?status=pending\|approved\|rejected\|expired`) |
| GET | `/api/payment-requests/{id}` | any | Get a single request |
| PATCH | `/api/payment-requests/{id}` | finance | Approve or reject a pending request |

**Create request body:**
```json
{
  "amount_local": 550.00,
  "currency_code": "BRL",
  "description": "Office supplies"
}
```

**PATCH (approve/reject) request body:**
```json
{ "status": "approved" }
```
```json
{ "status": "rejected" }
```

**Payment request response:**
```json
{
  "data": {
    "id": 1,
    "status": "pending",
    "amount_local": "550.00",
    "currency_code": "BRL",
    "amount_eur": "100.00",
    "exchange_rate": "5.500000",
    "rate_source": "exchangerate-api.com",
    "rate_fetched_at": "2026-06-09T12:00:00Z",
    "description": "Office supplies",
    "expires_at": "2026-06-11T12:00:00Z",
    "created_at": "2026-06-09T12:00:00Z"
  }
}
```

**List response (paginated):**
```json
{
  "data": [ ... ],
  "links": { "first": "...", "last": "...", "prev": null, "next": null },
  "meta": { "current_page": 1, "per_page": 15, "total": 3 }
}
```

**Error response:**
```json
{
  "message": "Human-readable error"
}
```

**Validation error (422):**
```json
{
  "message": "The currency code field must be 3 characters.",
  "errors": { "currency_code": ["The currency code field must be 3 characters."] }
}
```

### Exchange Rates

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/exchange-rate?currency={code}` | Get the current EUR → `{code}` exchange rate (auth required) |

**Response:**
```json
{
  "rate": 5.5,
  "source": "exchangerate-api.com",
  "fetched_at": "2026-06-12T12:00:00.000000Z"
}
```

### HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK |
| 201 | Created |
| 401 | Unauthenticated |
| 403 | Forbidden (wrong role) |
| 404 | Not found |
| 422 | Validation error or invalid state transition |
| 503 | Exchange rate API unavailable |

## Seeded Users

After running `php artisan migrate --seed`:

| Name | Email | Password | Role | Currency |
|------|-------|----------|------|----------|
| Alice Ferreira | alice@example.com | password | employee | BRL |
| João Martins | joao@example.com | password | employee | EUR |
| Sarah Connor | sarah@example.com | password | employee | USD |
| Yuki Tanaka | yuki@example.com | password | employee | JPY |
| Lena Müller | lena@example.com | password | employee | EUR |
| Carlos Romero | carlos@example.com | password | employee | MXN |
| Finance Admin | finance@example.com | password | **finance** | EUR |
