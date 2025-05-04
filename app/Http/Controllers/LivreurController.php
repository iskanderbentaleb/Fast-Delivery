<?php

namespace App\Http\Controllers;

use App\Models\Communes;
use App\Models\Livreur;
use App\Models\Wilaya;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class LivreurController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->input('search');
        $communes = Communes::select('id', 'commune_name' , 'wilaya_id')->get();

        $livreurs = Livreur::with('wilaya')
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhereHas('wilaya', function ($q) use ($search) {
                        $q->where('wilaya_name', 'like', "%{$search}%");
                    });
                });
            })
            ->latest()
            ->paginate(10)
            ->appends(['search' => $search]); // Keep search query in pagination

        return Inertia::render('admin/livreurs/index', [
            'livreurs' => $livreurs,
            'communes' => $communes,
            'search' => $search, // Pass search query to the frontend
        ]);
    }



    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $wilayas = Wilaya::select('id', 'wilaya_name')->get();
        return Inertia::render('admin/livreurs/create', [
            'wilayas' => $wilayas,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validate the incoming request
        $validated = $request->validate([
            'fullName' => 'required|string|min:2',
            'phone' => 'required|string|min:10',
            'email' => 'required|email|unique:livreurs,email',
            'wilaya' => 'required|exists:wilayas,id',
            'password' => 'required|string|min:6',
        ],
        [
            'fullName.required' => 'Le nom complet est obligatoire.',
            'fullName.min' => 'Le nom complet doit avoir au moins 2 caractères.',
            'phone.required' => 'Le numéro de téléphone est obligatoire.',
            'phone.min' => 'Le numéro de téléphone doit contenir au moins 10 chiffres.',
            'email.required' => "L'adresse e-mail est obligatoire.",
            'email.email' => "Veuillez entrer une adresse e-mail valide.",
            'email.unique' => "L'adresse e-mail est déjà utilisée.",
            'wilaya.required' => 'Veuillez sélectionner une wilaya.',
            'wilaya.exists' => 'La wilaya sélectionnée est invalide.',
            'password.required' => 'Le mot de passe est obligatoire.',
            'password.min' => 'Le mot de passe doit contenir au moins 6 caractères.',
        ]
        );

        // Create a new Livreur record
        Livreur::create([
            'name' => $validated['fullName'],
            'phone' => $validated['phone'],
            'email' => $validated['email'],
            'wilaya_id' => $validated['wilaya'],
            'password' => Hash::make($validated['password']), // Hash password before storing
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $livreur = Livreur::findOrFail($id); // Find Livreur by ID or return 404
        $livreur->delete(); // Delete the record
    }
}
