<?php

namespace App\Services;

use App\Exceptions\ExchangeRateUnavailableException;
use Illuminate\Support\Facades\Http;

class ExchangeRateService
{
    private const SOURCE = 'exchangerate-api.com';

    public function getRate(string $toCurrency): array
    {
        if ($toCurrency === 'EUR') {
            return [
                'rate'       => 1.0,
                'source'     => self::SOURCE,
                'fetched_at' => now(),
            ];
        }

        $url      = config('services.exchangerate.url') . '/EUR';
        $response = Http::get($url);

        if ($response->failed()) {
            throw new ExchangeRateUnavailableException('Failed to fetch exchange rate from ' . self::SOURCE);
        }

        $rates = $response->json('rates');

        if (! isset($rates[$toCurrency])) {
            throw new ExchangeRateUnavailableException("Currency code '{$toCurrency}' not supported.");
        }

        return [
            'rate'       => (float) $rates[$toCurrency],
            'source'     => self::SOURCE,
            'fetched_at' => now(),
        ];
    }
}
