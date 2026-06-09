<?php

namespace App\Policies;

use App\Models\PaymentRequest;
use App\Models\User;

class PaymentRequestPolicy
{
    public function view(User $user, PaymentRequest $paymentRequest): bool
    {
        return $user->role === 'finance' || $user->id === $paymentRequest->user_id;
    }

    public function review(User $user, PaymentRequest $paymentRequest): bool
    {
        return $user->role === 'finance';
    }
}
