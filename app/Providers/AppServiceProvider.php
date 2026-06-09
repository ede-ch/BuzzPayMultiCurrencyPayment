<?php

namespace App\Providers;

use App\Models\PaymentRequest;
use App\Policies\PaymentRequestPolicy;
use App\Services\ExchangeRateService;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(ExchangeRateService::class);
    }

    public function boot(): void
    {
        Gate::policy(PaymentRequest::class, PaymentRequestPolicy::class);
    }
}
