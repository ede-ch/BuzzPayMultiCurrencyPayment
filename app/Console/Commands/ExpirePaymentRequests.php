<?php

namespace App\Console\Commands;

use App\Models\PaymentRequest;
use Illuminate\Console\Command;

class ExpirePaymentRequests extends Command
{
    protected $signature   = 'payments:expire-pending';
    protected $description = 'Expire pending payment requests older than 48 hours';

    public function handle(): int
    {
        $count = PaymentRequest::pending()
            ->where('expires_at', '<', now())
            ->update(['status' => 'expired']);

        $this->info("Expired {$count} payment request(s).");

        return self::SUCCESS;
    }
}
