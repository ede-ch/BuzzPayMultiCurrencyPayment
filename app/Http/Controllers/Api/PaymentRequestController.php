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

/**
 * @group Payment Requests
 *
 * Manage multi-currency payment requests. All endpoints in this group
 * require a valid Sanctum bearer token (`Authorization: Bearer {token}`).
 * Employees can create requests and view their own; finance users can
 * view all requests and approve or reject pending ones.
 */
class PaymentRequestController extends Controller
{
    public function __construct(private PaymentRequestService $service) {}

    /**
     * List payment requests
     *
     * Returns a paginated list of payment requests. Employees see only
     * their own requests; finance users see requests from everyone.
     *
     * @authenticated
     *
     * @queryParam status string Filter by status. One of `pending`, `approved`, `rejected`, `expired`. Example: pending
     *
     * @response 200 {
     *   "data": [
     *     {
     *       "id": 1,
     *       "status": "pending",
     *       "amount_local": "550.00",
     *       "currency_code": "BRL",
     *       "amount_eur": "100.00",
     *       "exchange_rate": "5.500000",
     *       "rate_source": "exchangerate-api.com",
     *       "rate_fetched_at": "2026-06-12T12:00:00.000000Z",
     *       "description": "Office supplies",
     *       "expires_at": "2026-06-14T12:00:00.000000Z",
     *       "created_at": "2026-06-12T12:00:00.000000Z",
     *       "user": { "id": 1, "name": "Alice Ferreira" },
     *       "reviewer": null
     *     }
     *   ],
     *   "links": {
     *     "first": "http://localhost/api/payment-requests?page=1",
     *     "last": "http://localhost/api/payment-requests?page=1",
     *     "prev": null,
     *     "next": null
     *   },
     *   "meta": {
     *     "current_page": 1,
     *     "from": 1,
     *     "last_page": 1,
     *     "per_page": 15,
     *     "to": 1,
     *     "total": 1
     *   }
     * }
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $payments = $this->service->list($request->user(), $request->only('status'));

        return PaymentRequestResource::collection($payments);
    }

    /**
     * Create a payment request
     *
     * Submits a new payment request in the authenticated user's local
     * currency. The EUR exchange rate is fetched (and cached) at creation
     * time and stored alongside the request — it never changes afterwards.
     * The request is created with `status: pending` and `expires_at` set to
     * 48 hours from now.
     *
     * @authenticated
     *
     * @bodyParam amount_local number required The amount in the specified currency. Must be greater than 0. Example: 550.00
     * @bodyParam currency_code string required ISO 4217 3-letter currency code. Example: BRL
     * @bodyParam description string Optional note describing the payment. Example: Office supplies
     *
     * @response 201 {
     *   "data": {
     *     "id": 1,
     *     "status": "pending",
     *     "amount_local": "550.00",
     *     "currency_code": "BRL",
     *     "amount_eur": "100.00",
     *     "exchange_rate": "5.500000",
     *     "rate_source": "exchangerate-api.com",
     *     "rate_fetched_at": "2026-06-12T12:00:00.000000Z",
     *     "description": "Office supplies",
     *     "expires_at": "2026-06-14T12:00:00.000000Z",
     *     "created_at": "2026-06-12T12:00:00.000000Z",
     *     "user": { "id": 1, "name": "Alice Ferreira" },
     *     "reviewer": null
     *   }
     * }
     * @response 422 {
     *   "message": "The currency code field is invalid.",
     *   "errors": { "currency_code": ["The selected currency code is invalid."] }
     * }
     * @response 503 {
     *   "message": "Failed to fetch exchange rate from exchangerate-api.com"
     * }
     */
    public function store(StorePaymentRequestRequest $request): JsonResponse
    {
        $payment = $this->service->create($request->user(), $request->validated());

        return (new PaymentRequestResource($payment->load(['user', 'reviewer'])))
            ->response()
            ->setStatusCode(201);
    }

    /**
     * Get a payment request
     *
     * Returns the details of a single payment request. Employees may only
     * view their own requests; finance users may view any request.
     *
     * @authenticated
     *
     * @urlParam paymentRequest int required The ID of the payment request. Example: 1
     *
     * @response 200 {
     *   "data": {
     *     "id": 1,
     *     "status": "pending",
     *     "amount_local": "550.00",
     *     "currency_code": "BRL",
     *     "amount_eur": "100.00",
     *     "exchange_rate": "5.500000",
     *     "rate_source": "exchangerate-api.com",
     *     "rate_fetched_at": "2026-06-12T12:00:00.000000Z",
     *     "description": "Office supplies",
     *     "expires_at": "2026-06-14T12:00:00.000000Z",
     *     "created_at": "2026-06-12T12:00:00.000000Z",
     *     "user": { "id": 1, "name": "Alice Ferreira" },
     *     "reviewer": null
     *   }
     * }
     * @response 403 {
     *   "message": "This action is unauthorized."
     * }
     * @response 404 {
     *   "message": "No query results for model [App\\Models\\PaymentRequest] 999"
     * }
     */
    public function show(Request $request, PaymentRequest $paymentRequest): PaymentRequestResource
    {
        $this->authorize('view', $paymentRequest);

        return new PaymentRequestResource($paymentRequest->load(['user', 'reviewer']));
    }

    /**
     * Approve or reject a payment request
     *
     * Transitions a `pending` payment request to `approved` or `rejected`.
     * Only users with the `finance` role may perform this action, and only
     * requests currently `pending` can be transitioned. The exchange rate
     * stored on the request is never re-fetched.
     *
     * @authenticated
     *
     * @urlParam paymentRequest int required The ID of the payment request. Example: 1
     *
     * @bodyParam status string required The new status. Must be `approved` or `rejected`. Example: approved
     *
     * @response 200 {
     *   "data": {
     *     "id": 1,
     *     "status": "approved",
     *     "amount_local": "550.00",
     *     "currency_code": "BRL",
     *     "amount_eur": "100.00",
     *     "exchange_rate": "5.500000",
     *     "rate_source": "exchangerate-api.com",
     *     "rate_fetched_at": "2026-06-12T12:00:00.000000Z",
     *     "description": "Office supplies",
     *     "expires_at": "2026-06-14T12:00:00.000000Z",
     *     "created_at": "2026-06-12T12:00:00.000000Z",
     *     "user": { "id": 1, "name": "Alice Ferreira" },
     *     "reviewer": { "id": 7, "name": "Finance Admin" }
     *   }
     * }
     * @response 403 {
     *   "message": "This action is unauthorized."
     * }
     * @response 422 {
     *   "message": "Only pending requests can be approved."
     * }
     */
    public function update(UpdatePaymentRequestRequest $request, PaymentRequest $paymentRequest): PaymentRequestResource
    {
        $this->authorize('review', $paymentRequest);

        $updated = $this->service->updateStatus($paymentRequest, $request->status, $request->user());

        return new PaymentRequestResource($updated);
    }
}
