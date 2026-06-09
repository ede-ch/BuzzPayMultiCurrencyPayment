<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePaymentRequestRequest;
use App\Http\Requests\UpdatePaymentRequestRequest;
use App\Http\Resources\PaymentRequestResource;
use App\Models\PaymentRequest;
use App\Services\PaymentRequestService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class PaymentRequestController extends Controller
{
    public function __construct(private PaymentRequestService $service) {}

    public function index(Request $request): AnonymousResourceCollection
    {
        $payments = $this->service->list($request->user(), $request->only('status'));

        return PaymentRequestResource::collection($payments);
    }

    public function store(StorePaymentRequestRequest $request): JsonResponse
    {
        $payment = $this->service->create($request->user(), $request->validated());

        return (new PaymentRequestResource($payment->load(['user', 'reviewer'])))
            ->response()
            ->setStatusCode(201);
    }

    public function show(Request $request, PaymentRequest $paymentRequest): PaymentRequestResource
    {
        $this->authorize('view', $paymentRequest);

        return new PaymentRequestResource($paymentRequest->load(['user', 'reviewer']));
    }

    public function update(UpdatePaymentRequestRequest $request, PaymentRequest $paymentRequest): JsonResponse|PaymentRequestResource
    {
        $this->authorize('review', $paymentRequest);

        if (! $paymentRequest->isPending()) {
            return response()->json(
                ['message' => 'Only pending requests can be ' . $request->status . '.'],
                422
            );
        }

        $updated = $this->service->updateStatus($paymentRequest, $request->status, $request->user());

        return new PaymentRequestResource($updated);
    }
}
