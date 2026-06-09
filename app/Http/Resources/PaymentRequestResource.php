<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PaymentRequestResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'             => $this->id,
            'status'         => $this->status,
            'amount_local'   => $this->amount_local,
            'currency_code'  => $this->currency_code,
            'amount_eur'     => $this->amount_eur,
            'exchange_rate'  => $this->exchange_rate,
            'rate_source'    => $this->rate_source,
            'rate_fetched_at'=> $this->rate_fetched_at?->toISOString(),
            'description'    => $this->description,
            'expires_at'     => $this->expires_at?->toISOString(),
            'created_at'     => $this->created_at?->toISOString(),
        ];
    }
}
