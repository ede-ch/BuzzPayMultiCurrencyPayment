<?php

namespace App\Services;

use App\Exceptions\ExchangeRateUnavailableException;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class ExchangeRateService
{
    private const SOURCE = 'exchangerate-api.com';

    /**
     * Get the EUR -> $toCurrency exchange rate.
     *
     * Non-EUR rates are cached per currency for `services.exchangerate.cache_ttl`
     * seconds. `fetched_at` is captured inside the cache closure, so a cache hit
     * returns the timestamp of the original fetch rather than now() — this keeps
     * `rate_fetched_at` meaningful as a "how stale is this rate" audit field on
     * payment requests.
     *
     * @throws ExchangeRateUnavailableException
     */
    public function getRate(string $toCurrency): array
    {
        if ($toCurrency === 'EUR') {
            return [
                'rate' => 1.0,
                'source' => self::SOURCE,
                'fetched_at' => now(),
            ];
        }

        $ttl = (int) config('services.exchangerate.cache_ttl', 3600);

        return Cache::remember("exchange-rate:{$toCurrency}", $ttl, function () use ($toCurrency) {
            $url = config('services.exchangerate.url').'/EUR';
            $response = Http::get($url);

            if ($response->failed()) {
                throw new ExchangeRateUnavailableException('Failed to fetch exchange rate from '.self::SOURCE);
            }

            $rates = $response->json('rates');

            if (! isset($rates[$toCurrency])) {
                throw new ExchangeRateUnavailableException("Currency code '{$toCurrency}' not supported.");
            }

            return [
                'rate' => (float) $rates[$toCurrency],
                'source' => self::SOURCE,
                'fetched_at' => now(),
            ];
        });
    }
}
