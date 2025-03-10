<?php

namespace App\Http\Controllers\Auth\Livreur;
use Illuminate\Support\Str;
use App\Http\Controllers\Controller;
use App\Models\Livreur;
use App\Notifications\CustomResetPasswordNotification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Inertia\Inertia;
use Inertia\Response;

class PasswordResetLinkController extends Controller
{
    /**
     * Show the password reset link request page.
     */
    public function create(Request $request): Response
    {
        return Inertia::render('auth/Livreur/forgot-password', [
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Handle an incoming password reset link request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    // public function store(Request $request): RedirectResponse
    // {
    //     $request->validate([
    //         'email' => 'required|email',
    //     ]);


    //     Password::broker('livreurs')->sendResetLink(
    //         $request->only('email')
    //     );

    //     return back()->with('status', __('A reset link will be sent if the account exists.'));
    // }

    // public function store(Request $request): RedirectResponse
    // {
    //     $request->validate(['email' => 'required|email']);

    //     Password::broker('livreurs')->sendResetLink(
    //         $request->only('email'),
    //         function ($user, $token) {
    //             return url(route('livreur.password.reset', [
    //                 'token' => $token,
    //                 'email' => $user->email
    //             ]));
    //         }
    //     );

    //     return back()->with('status', __('A reset link will be sent if the account exists.'));
    // }


    public function store(Request $request): RedirectResponse
    {
        $request->validate(['email' => 'required|email']);

        // Find the user by email
        $user = Livreur::where('email', $request->email)->first();

        if (!$user) {
            return back()->withErrors(['email' => __('We could not find a user with that email address.')]);
        }

        // Generate a token
        $token = Str::random(64);

        // Save the token to the password_reset_tokens table
        \DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $user->email],
            ['token' => Hash::make($token), 'created_at' => now()]
        );

        // Generate the reset URL
        $resetUrl = url(route('livreur.password.reset', [
            'token' => $token,
            'email' => $user->email,
        ]));

        // Send the custom notification
        $user->notify(new CustomResetPasswordNotification($token, $resetUrl));

        return back()->with('status', __('A reset link will be sent if the account exists.'));
    }
}
