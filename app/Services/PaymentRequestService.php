<?php

namespace App\Services;

use App\Exceptions\InvalidStatusTransitionException;
use App\Models\PaymentRequest;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class PaymentRequestService
{
    public function __construct(private ExchangeRateService $exchangeRate) {}

    public function list(User $user, array $filters = []): LengthAwarePaginator
    {
        $query = $user->isFinance()
            ? PaymentRequest::with(['user', 'reviewer'])
            : $user->paymentRequests()->with('reviewer');

        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        return $query->latest()->paginate(15);
    }

    public function create(User $user, array $data): PaymentRequest
    {
        $rateData = $this->exchangeRate->getRate($data['currency_code']);

        return $user->paymentRequests()->create([
            'amount_local'    => $data['amount_local'],
            'currency_code'   => $data['currency_code'],
            'amount_eur'      => round($data['amount_local'] / $rateData['rate'], 2),
            'exchange_rate'   => $rateData['rate'],
            'rate_source'     => $rateData['source'],
            'rate_fetched_at' => $rateData['fetched_at'],
            'description'     => $data['description'] ?? null,
            'status'          => 'pending',
            'expires_at'      => now()->addHours(48),
        ]);
    }

    public function updateStatus(PaymentRequest $paymentRequest, string $status, User $reviewer): PaymentRequest
    {
        if (! $paymentRequest->isPending()) {
            throw new InvalidStatusTransitionException("Only pending requests can be {$status}.");
        }

        $paymentRequest->update([
            'status'      => $status,
            'reviewed_by' => $reviewer->id,
            'reviewed_at' => now(),
        ]);

        return $paymentRequest->fresh(['user', 'reviewer']);
    }
}
