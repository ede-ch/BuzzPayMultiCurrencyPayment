<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePaymentRequestRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'amount_local' => ['required', 'numeric', 'min:0.01'],
            'currency_code' => ['required', 'string', 'size:3', 'regex:/^[A-Z]{3}$/', Rule::in(config('currencies.iso4217'))],
            'description' => ['nullable', 'string', 'max:255'],
        ];
    }
}
