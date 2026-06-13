<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class ExchangeRateEndpointTest extends TestCase
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

    public function test_authenticated_user_can_get_exchange_rate(): void
    {
        $this->fakeExchangeRate(5.5);

        $response = $this->actingAs(User::factory()->create())
            ->getJson('/api/exchange-rate?currency=BRL');

        $response->assertStatus(200)
            ->assertJsonPath('rate', 5.5)
            ->assertJsonPath('source', 'exchangerate-api.com')
            ->assertJsonStructure(['rate', 'source', 'fetched_at']);
    }

    public function test_eur_returns_rate_of_one(): void
    {
        $response = $this->actingAs(User::factory()->create())
            ->getJson('/api/exchange-rate?currency=EUR');

        $response->assertStatus(200)
            ->assertJsonPath('rate', 1);
    }

    public function test_invalid_currency_returns_422(): void
    {
        $response = $this->actingAs(User::factory()->create())
            ->getJson('/api/exchange-rate?currency=XXX');

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['currency']);
    }

    public function test_unauthenticated_user_cannot_get_exchange_rate(): void
    {
        $response = $this->getJson('/api/exchange-rate?currency=BRL');

        $response->assertStatus(401);
    }

    public function test_returns_503_when_exchange_rate_api_unavailable(): void
    {
        Http::fake([
            'https://api.exchangerate-api.com/*' => Http::response([], 500),
        ]);

        $response = $this->actingAs(User::factory()->create())
            ->getJson('/api/exchange-rate?currency=BRL');

        $response->assertStatus(503);
    }
}
