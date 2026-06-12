<?php

namespace Tests\Feature;

use App\Models\PaymentRequest;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class PaymentRequestTest extends TestCase
{
    use RefreshDatabase;

    private function fakeExchangeRate(float $rate = 5.5): void
    {
        Http::fake([
            'https://api.exchangerate-api.com/*' => Http::response([
                'rates' => ['BRL' => $rate, 'GBP' => 0.85],
            ]),
        ]);
    }

    private function employee(): User
    {
        return User::factory()->create(['role' => 'employee']);
    }

    private function finance(): User
    {
        return User::factory()->create(['role' => 'finance']);
    }

    public function test_employee_can_create_payment_request(): void
    {
        $this->fakeExchangeRate(5.5);

        $response = $this->actingAs($this->employee())
            ->postJson('/api/payment-requests', [
                'amount_local' => 110.00,
                'currency_code' => 'BRL',
                'description' => 'Office supplies',
            ]);

        $response->assertStatus(201)
            ->assertJsonFragment(['currency_code' => 'BRL', 'status' => 'pending']);

        $this->assertDatabaseHas('payment_requests', [
            'currency_code' => 'BRL',
            'exchange_rate' => 5.5,
            'status' => 'pending',
        ]);
    }

    public function test_exchange_rate_is_stored_at_creation_and_immutable(): void
    {
        $this->fakeExchangeRate(5.5);

        $employee = $this->employee();
        $this->actingAs($employee)->postJson('/api/payment-requests', [
            'amount_local' => 55.00,
            'currency_code' => 'BRL',
            'description' => 'Test',
        ]);

        $payment = PaymentRequest::first();
        $this->assertEquals(5.5, $payment->exchange_rate);
        $this->assertEquals('exchangerate-api.com', $payment->rate_source);
        $this->assertNotNull($payment->rate_fetched_at);
    }

    public function test_amount_eur_is_correctly_calculated(): void
    {
        $this->fakeExchangeRate(5.0);

        $this->actingAs($this->employee())->postJson('/api/payment-requests', [
            'amount_local' => 50.00,
            'currency_code' => 'BRL',
            'description' => 'Test',
        ]);

        $this->assertDatabaseHas('payment_requests', ['amount_eur' => 10.0000]);
    }

    public function test_create_with_invalid_currency_returns_422(): void
    {
        $this->fakeExchangeRate();

        $this->actingAs($this->employee())
            ->postJson('/api/payment-requests', [
                'amount_local' => 100.00,
                'currency_code' => 'ZZZ',
                'description' => 'Invalid currency',
            ])
            ->assertStatus(422)
            ->assertJsonValidationErrors('currency_code');
    }

    public function test_create_with_negative_amount_returns_422(): void
    {
        $this->fakeExchangeRate();

        $this->actingAs($this->employee())
            ->postJson('/api/payment-requests', [
                'amount_local' => -10,
                'currency_code' => 'BRL',
                'description' => 'Negative amount',
            ])
            ->assertStatus(422)
            ->assertJsonValidationErrors('amount_local');
    }

    public function test_employee_can_only_see_own_requests(): void
    {
        $this->fakeExchangeRate();

        $employee1 = $this->employee();
        $employee2 = $this->employee();

        PaymentRequest::factory()->for($employee1)->create();
        PaymentRequest::factory()->for($employee2)->create();

        $response = $this->actingAs($employee1)->getJson('/api/payment-requests');

        $response->assertStatus(200);
        $this->assertEquals(1, $response->json('meta.total'));
    }

    public function test_finance_can_see_all_requests(): void
    {
        $this->fakeExchangeRate();

        PaymentRequest::factory()->for($this->employee())->create();
        PaymentRequest::factory()->for($this->employee())->create();

        $this->actingAs($this->finance())
            ->getJson('/api/payment-requests')
            ->assertStatus(200)
            ->assertJsonPath('meta.total', 2);
    }

    public function test_status_filter_works(): void
    {
        $this->fakeExchangeRate();

        $employee = $this->employee();
        PaymentRequest::factory()->for($employee)->create(['status' => 'pending']);
        PaymentRequest::factory()->for($employee)->create(['status' => 'approved']);

        $response = $this->actingAs($employee)->getJson('/api/payment-requests?status=pending');
        $this->assertEquals(1, $response->json('meta.total'));
    }

    public function test_finance_can_approve_pending_request(): void
    {
        $this->fakeExchangeRate();
        $payment = PaymentRequest::factory()->for($this->employee())->create(['status' => 'pending']);

        $this->actingAs($this->finance())
            ->patchJson("/api/payment-requests/{$payment->id}", ['status' => 'approved'])
            ->assertStatus(200)
            ->assertJsonFragment(['status' => 'approved']);
    }

    public function test_finance_can_reject_pending_request(): void
    {
        $this->fakeExchangeRate();
        $payment = PaymentRequest::factory()->for($this->employee())->create(['status' => 'pending']);

        $this->actingAs($this->finance())
            ->patchJson("/api/payment-requests/{$payment->id}", ['status' => 'rejected'])
            ->assertStatus(200)
            ->assertJsonFragment(['status' => 'rejected']);
    }

    public function test_employee_cannot_approve_request(): void
    {
        $payment = PaymentRequest::factory()->for($this->employee())->create(['status' => 'pending']);

        $this->actingAs($this->employee())
            ->patchJson("/api/payment-requests/{$payment->id}", ['status' => 'approved'])
            ->assertStatus(403);
    }

    public function test_cannot_approve_non_pending_request(): void
    {
        $payment = PaymentRequest::factory()->for($this->employee())->create(['status' => 'rejected']);

        $this->actingAs($this->finance())
            ->patchJson("/api/payment-requests/{$payment->id}", ['status' => 'approved'])
            ->assertStatus(422);
    }
}
