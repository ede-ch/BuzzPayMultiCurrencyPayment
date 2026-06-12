<?php

namespace Tests\Feature;

use App\Models\PaymentRequest;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExpirationTest extends TestCase
{
    use RefreshDatabase;

    public function test_command_expires_stale_pending_requests(): void
    {
        $employee = User::factory()->create(['role' => 'employee']);

        $stale = PaymentRequest::factory()->for($employee)->create([
            'status' => 'pending',
            'expires_at' => now()->subHour(),
        ]);

        $fresh = PaymentRequest::factory()->for($employee)->create([
            'status' => 'pending',
            'expires_at' => now()->addHours(24),
        ]);

        $this->artisan('payments:expire-pending')->assertSuccessful();

        $this->assertEquals('expired', $stale->fresh()->status);
        $this->assertEquals('pending', $fresh->fresh()->status);
    }

    public function test_command_does_not_touch_approved_requests(): void
    {
        $employee = User::factory()->create(['role' => 'employee']);

        $approved = PaymentRequest::factory()->for($employee)->create([
            'status' => 'approved',
            'expires_at' => now()->subHour(),
        ]);

        $this->artisan('payments:expire-pending')->assertSuccessful();

        $this->assertEquals('approved', $approved->fresh()->status);
    }
}
