<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

/**
 * @group Authentication
 *
 * Endpoints for registering, authenticating and logging out users via
 * Laravel Sanctum personal access tokens.
 */
class AuthController extends Controller
{
    /**
     * Register
     *
     * Creates a new user account and returns a Sanctum bearer token that
     * can be used to authenticate subsequent requests. New accounts default
     * to the `employee` role.
     *
     * @bodyParam name string required The user's full name. Example: Alice Ferreira
     * @bodyParam email string required A unique, valid email address. Example: alice@example.com
     * @bodyParam password string required Minimum 8 characters. Example: password123
     * @bodyParam password_confirmation string required Must match the password field. Example: password123
     * @bodyParam country string required The user's country. Example: Brazil
     * @bodyParam currency_code string required ISO 4217 3-letter currency code (stored uppercased). Example: BRL
     *
     * @response 201 {
     *   "user": {
     *     "id": 1,
     *     "name": "Alice Ferreira",
     *     "email": "alice@example.com",
     *     "role": "employee",
     *     "country": "Brazil",
     *     "currency_code": "BRL"
     *   },
     *   "access_token": "1|abcdef1234567890",
     *   "token_type": "Bearer"
     * }
     * @response 422 {
     *   "message": "The email has already been taken.",
     *   "errors": {
     *     "email": ["The email has already been taken."]
     *   }
     * }
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'country' => $request->country,
            'currency_code' => strtoupper($request->currency_code),
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => new UserResource($user),
            'access_token' => $token,
            'token_type' => 'Bearer',
        ], 201);
    }

    /**
     * Login
     *
     * Authenticates a user with email and password and returns a new
     * Sanctum bearer token.
     *
     * @bodyParam email string required The user's email address. Example: alice@example.com
     * @bodyParam password string required The user's password. Example: password123
     *
     * @response 200 {
     *   "user": {
     *     "id": 1,
     *     "name": "Alice Ferreira",
     *     "email": "alice@example.com",
     *     "role": "employee",
     *     "country": "Brazil",
     *     "currency_code": "BRL"
     *   },
     *   "access_token": "2|fedcba0987654321",
     *   "token_type": "Bearer"
     * }
     * @response 401 {
     *   "message": "The provided credentials are incorrect."
     * }
     */
    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        if (! Auth::attempt($request->only('email', 'password'))) {
            return response()->json(['message' => 'The provided credentials are incorrect.'], 401);
        }

        /** @var User $user */
        $user = Auth::user();
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => new UserResource($user),
            'access_token' => $token,
            'token_type' => 'Bearer',
        ]);
    }

    /**
     * Logout
     *
     * Revokes the bearer token used to authenticate the current request.
     *
     * @authenticated
     *
     * @response 200 {
     *   "message": "Logged out successfully."
     * }
     * @response 401 {
     *   "message": "Unauthenticated."
     * }
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully.']);
    }
}
