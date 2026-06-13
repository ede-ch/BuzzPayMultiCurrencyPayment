<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\ExchangeRateService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

/**
 * @group Exchange Rates
 *
 * Look up the current EUR exchange rate for a currency. Useful for showing
 * a live conversion estimate before submitting a payment request.
 */
class ExchangeRateController extends Controller
{
    public function __construct(private ExchangeRateService $service) {}

    /**
     * Get the current exchange rate for a currency
     *
     * @authenticated
     *
     * @queryParam currency string required ISO 4217 3-letter currency code. Example: BRL
     *
     * @response 200 {
     *   "rate": 5.5,
     *   "source": "exchangerate-api.com",
     *   "fetched_at": "2026-06-12T12:00:00.000000Z"
     * }
     * @response 422 {
     *   "message": "The currency field is invalid.",
     *   "errors": { "currency": ["The selected currency is invalid."] }
     * }
     * @response 503 {
     *   "message": "Failed to fetch exchange rate from exchangerate-api.com"
     * }
     */
    public function show(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'currency' => ['required', 'string', 'size:3', 'regex:/^[A-Z]{3}$/', Rule::in(config('currencies.iso4217'))],
        ]);

        return response()->json($this->service->getRate($validated['currency']));
    }
}
