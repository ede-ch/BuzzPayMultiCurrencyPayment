<?php

namespace Tests\Unit;

use App\Exceptions\ExchangeRateUnavailableException;
use App\Services\ExchangeRateService;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class ExchangeRateServiceTest extends TestCase
{
    private ExchangeRateService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = app(ExchangeRateService::class);
        Cache::flush();
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

    public function test_repeated_calls_for_same_currency_use_cache(): void
    {
        Http::fake([
            '*' => Http::response([
                'rates' => ['BRL' => 5.43, 'USD' => 1.08],
            ], 200),
        ]);

        $first = $this->service->getRate('BRL');
        $second = $this->service->getRate('BRL');

        Http::assertSentCount(1);

        $this->assertEquals($first['rate'], $second['rate']);
        $this->assertEquals(
            $first['fetched_at']->toISOString(),
            $second['fetched_at']->toISOString(),
            'Cached fetched_at must reflect the original fetch time, not the time of the second call.'
        );
    }

    public function test_different_currencies_trigger_separate_http_calls(): void
    {
        Http::fake([
            '*' => Http::response([
                'rates' => ['BRL' => 5.43, 'USD' => 1.08],
            ], 200),
        ]);

        $this->service->getRate('BRL');
        $this->service->getRate('USD');

        Http::assertSentCount(2);
    }
}
