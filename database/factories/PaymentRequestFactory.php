<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class PaymentRequestFactory extends Factory
{
    public function definition(): array
    {
        $currencies = ['BRL', 'GBP', 'MXN', 'CHF', 'JPY'];
        $rate = fake()->randomFloat(4, 0.5, 150);
        $local = fake()->randomFloat(2, 10, 5000);

        return [
            'user_id' => User::factory(),
            'amount_local' => $local,
            'currency_code' => fake()->randomElement($currencies),
            'amount_eur' => round($local / $rate, 4),
            'exchange_rate' => $rate,
            'rate_source' => 'exchangerate-api.com',
            'rate_fetched_at' => now(),
            'status' => 'pending',
            'description' => fake()->sentence(),
            'expires_at' => now()->addHours(48),
        ];
    }
}
