<?php

namespace Database\Seeders;

use App\Models\PaymentRequest;
use App\Models\User;
use Illuminate\Database\Seeder;

class PaymentRequestSeeder extends Seeder
{
    public function run(): void
    {
        $employees = User::where('role', 'employee')->get();

        if ($employees->isEmpty()) {
            return;
        }

        $samples = [
            ['currency_code' => 'BRL', 'amount_local' => 550.00,  'rate' => 5.43,   'description' => 'Office supplies'],
            ['currency_code' => 'USD', 'amount_local' => 200.00,  'rate' => 1.08,   'description' => 'Conference registration'],
            ['currency_code' => 'JPY', 'amount_local' => 15000.00,'rate' => 163.50, 'description' => 'Team dinner'],
            ['currency_code' => 'MXN', 'amount_local' => 1200.00, 'rate' => 17.80,  'description' => 'Travel expenses'],
            ['currency_code' => 'EUR', 'amount_local' => 300.00,  'rate' => 1.0,    'description' => 'Software license'],
        ];

        foreach ($samples as $index => $sample) {
            $employee = $employees[$index % $employees->count()];

            PaymentRequest::create([
                'user_id'         => $employee->id,
                'amount_local'    => $sample['amount_local'],
                'currency_code'   => $sample['currency_code'],
                'amount_eur'      => round($sample['amount_local'] / $sample['rate'], 2),
                'exchange_rate'   => $sample['rate'],
                'rate_source'     => 'exchangerate-api.com',
                'rate_fetched_at' => now(),
                'status'          => 'pending',
                'description'     => $sample['description'],
                'expires_at'      => now()->addHours(48),
            ]);
        }
    }
}
