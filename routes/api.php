<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PaymentRequestController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->post('logout', [AuthController::class, 'logout']);
});

Route::middleware('auth:sanctum')->prefix('payment-requests')->group(function () {
    Route::get('/', [PaymentRequestController::class, 'index']);
    Route::post('/', [PaymentRequestController::class, 'store']);
    Route::get('{paymentRequest}', [PaymentRequestController::class, 'show']);
    Route::patch('{paymentRequest}', [PaymentRequestController::class, 'update']);
});
