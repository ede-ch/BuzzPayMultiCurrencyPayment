# BuzzvelMultiCurrencyPayment

A REST API built with Laravel 12 for managing multi-currency payment requests. Employees submit payments in their local currency; the system fetches real-time exchange rates and routes requests to the finance team for approval.

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

# 4. Edit .env with your database credentials
#    DB_CONNECTION=mysql
#    DB_HOST=127.0.0.1
#    DB_PORT=3306
#    DB_DATABASE=buzzvel_payment
#    DB_USERNAME=root
#    DB_PASSWORD=

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
php artisan payments:expire
```

## API Reference

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login — returns Bearer token |
| POST | `/api/auth/logout` | Revoke token (requires auth) |

**Register / Login request body:**
```json
{
  "name": "Alice Smith",
  "email": "alice@example.com",
  "password": "password",
  "password_confirmation": "password"
}
```

**Response:**
```json
{
  "user": { "id": 1, "name": "Alice Smith", "email": "alice@example.com", "role": "employee" },
  "access_token": "1|abc...",
  "token_type": "Bearer"
}
```

### Payment Requests

All endpoints require `Authorization: Bearer {token}` header.

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| POST | `/api/payment-requests` | any | Create a payment request |
| GET | `/api/payment-requests` | any | List requests (`?status=pending`) |
| GET | `/api/payment-requests/{id}` | any | Get a single request |
| PATCH | `/api/payment-requests/{id}/approve` | finance | Approve a pending request |
| PATCH | `/api/payment-requests/{id}/reject` | finance | Reject a pending request |

**Create request body:**
```json
{
  "amount_local": 550.00,
  "currency_code": "BRL",
  "description": "Office supplies"
}
```

**Response:**
```json
{
  "id": 1,
  "user_id": 1,
  "amount_local": "550.0000",
  "currency_code": "BRL",
  "amount_eur": "100.0000",
  "exchange_rate": "5.500000",
  "rate_source": "exchangerate-api.com",
  "rate_fetched_at": "2026-06-09T12:00:00Z",
  "status": "pending",
  "description": "Office supplies",
  "expires_at": "2026-06-11T12:00:00Z"
}
```

## Seeded Users

After running `php artisan migrate --seed`:

| Email | Password | Role |
|-------|----------|------|
| alice@example.com | password | employee (BRL) |
| bob@example.com | password | employee (GBP) |
| carlos@example.com | password | employee (MXN) |
| marie@example.com | password | employee (CHF) |
| hiroshi@example.com | password | employee (JPY) |
| finance@example.com | password | **finance** |
