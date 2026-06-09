<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            ['name' => 'Alice Ferreira',  'email' => 'alice@example.com',   'role' => 'employee', 'country' => 'Brazil',        'currency_code' => 'BRL'],
            ['name' => 'João Martins',    'email' => 'joao@example.com',    'role' => 'employee', 'country' => 'Portugal',      'currency_code' => 'EUR'],
            ['name' => 'Sarah Connor',    'email' => 'sarah@example.com',   'role' => 'employee', 'country' => 'United States', 'currency_code' => 'USD'],
            ['name' => 'Yuki Tanaka',     'email' => 'yuki@example.com',    'role' => 'employee', 'country' => 'Japan',         'currency_code' => 'JPY'],
            ['name' => 'Lena Müller',     'email' => 'lena@example.com',    'role' => 'employee', 'country' => 'Germany',       'currency_code' => 'EUR'],
            ['name' => 'Carlos Romero',   'email' => 'carlos@example.com',  'role' => 'employee', 'country' => 'Mexico',        'currency_code' => 'MXN'],
            ['name' => 'Finance Admin',   'email' => 'finance@example.com', 'role' => 'finance',  'country' => 'Germany',       'currency_code' => 'EUR'],
        ];

        foreach ($users as $data) {
            User::firstOrCreate(
                ['email' => $data['email']],
                array_merge($data, ['password' => Hash::make('password')])
            );
        }
    }
}
