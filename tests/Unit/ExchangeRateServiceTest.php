<?php

namespace Tests\Unit;

use App\Exceptions\ExchangeRateUnavailableException;
use App\Services\ExchangeRateService;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class ExchangeRateServiceTest extends TestCase
{
    private ExchangeRateService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = app(ExchangeRateService::class);
    }

    public function test_returns_correct_rate_data(): void
    {
        Http::fake([
            '*' => Http::response([
                'rates' => ['BRL' => 5.43, 'USD' => 1.08],
            ], 200),
        ]);

        $result = $this->service->getRate('BRL');

        $this->assertEquals(5.43, $result['rate']);
        $this->assertEquals('exchangerate-api.com', $result['source']);
        $this->assertNotNull($result['fetched_at']);
    }

    public function test_throws_exception_on_http_failure(): void
    {
        Http::fake([
            '*' => Http::response([], 500),
        ]);

        $this->expectException(ExchangeRateUnavailableException::class);

        $this->service->getRate('BRL');
    }

    public function test_throws_exception_for_missing_currency(): void
    {
        Http::fake([
            '*' => Http::response([
                'rates' => ['USD' => 1.08],
            ], 200),
        ]);

        $this->expectException(ExchangeRateUnavailableException::class);

        $this->service->getRate('BRL');
    }

    public function test_eur_edge_case_skips_http_call(): void
    {
        Http::fake();

        $result = $this->service->getRate('EUR');

        Http::assertNothingSent();
        $this->assertEquals(1.0, $result['rate']);
        $this->assertEquals('exchangerate-api.com', $result['source']);
    }
}
