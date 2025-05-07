<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\Colie;
use App\Models\Communes;
use App\Models\Status;
use App\Models\Wilaya;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ColieController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');

        $communes = Communes::select('id', 'commune_name', 'wilaya_id')->get();

        $colies = Colie::with(['wilaya', 'commune', 'status', 'payment'])
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('client_fullname', 'like', "%{$search}%")
                        ->orWhere('client_phone', 'like', "%{$search}%")
                        ->orWhere('tracking', 'like', "%{$search}%")
                        ->orWhere('external_id', 'like', "%{$search}%")
                        ->orWhereHas('wilaya', fn($w) => $w->where('wilaya_name', 'like', "%{$search}%"))
                        ->orWhereHas('commune', fn($c) => $c->where('commune_name', 'like', "%{$search}%"))
                        ->orWhereHas('status', fn($s) => $s->where('status', 'like', "%{$search}%"));
                });
            })
            ->latest()
            ->paginate(10)
            ->appends(['search' => $search]);

        return Inertia::render('admin/colies/index', [
            'colies' => $colies,
            'communes' => $communes,
            'search' => $search,
        ]);
    }

    // /**
    //  * Show the form for creating a new colie.
    //  */
    // public function create()
    // {
    //     return Inertia::render('admin/colies/create');
    // }

    // /**
    //  * Store a newly created colie in storage.
    //  */
    // public function store(Request $request)
    // {
    //     $validated = $request->validate([
    //         'id' => 'required|string|size:9|unique:colies,id',
    //         'tracking' => 'required|string|size:6|unique:colies,tracking',
    //         'client_fullname' => 'required|string|max:50',
    //         'client_phone' => 'required|string|max:50',
    //         'client_address' => 'required|string|max:100',
    //         'products' => 'required|string|max:100',
    //         'external_id' => 'required|string|max:30',
    //         'client_amount' => 'required|numeric',
    //         'livreur_amount' => 'required|numeric',
    //         'product_value' => 'required|numeric',
    //         'return_fee' => 'required|numeric',
    //         'has_exchange' => 'boolean',

    //         'id_wilaya' => 'required|integer|exists:wilayas,id',
    //         'id_commune' => 'required|integer|exists:communes,id',
    //         'id_exchange_return' => 'nullable|string|exists:colies,id',
    //         'id_status' => 'required|string|exists:statuses,id',
    //         'id_payment' => 'nullable|uuid|exists:payments,id',
    //     ]);

    //     Colie::create($validated);

    //     return redirect()->route('colies.index')->with('success', 'Colie created successfully.');
    // }

    // /**
    //  * Show the form for editing the specified colie.
    //  */
    // public function edit(Colie $colie)
    // {
    //     return Inertia::render('admin/colies/edit', [
    //         'colie' => $colie->load(['wilaya', 'commune', 'status', 'payment']),
    //     ]);
    // }

    // /**
    //  * Update the specified colie in storage.
    //  */
    // public function update(Request $request, Colie $colie)
    // {
    //     $validated = $request->validate([
    //         'client_fullname' => 'required|string|max:50',
    //         'client_phone' => 'required|string|max:50',
    //         'client_address' => 'required|string|max:100',
    //         'products' => 'required|string|max:100',
    //         'external_id' => 'required|string|max:30',
    //         'client_amount' => 'required|numeric',
    //         'livreur_amount' => 'required|numeric',
    //         'product_value' => 'required|numeric',
    //         'return_fee' => 'required|numeric',
    //         'has_exchange' => 'boolean',

    //         'id_wilaya' => 'required|integer|exists:wilayas,id',
    //         'id_commune' => 'required|integer|exists:communes,id',
    //         'id_exchange_return' => 'nullable|string|exists:colies,id',
    //         'id_status' => 'required|string|exists:statuses,id',
    //         'id_payment' => 'nullable|uuid|exists:payments,id',
    //     ]);

    //     $colie->update($validated);

    //     return redirect()->route('colies.index')->with('success', 'Colie updated successfully.');
    // }

    // /**
    //  * Remove the specified colie from storage.
    //  */
    // public function destroy(Colie $colie)
    // {
    //     $colie->delete();

    //     return redirect()->route('colies.index')->with('success', 'Colie deleted successfully.');
    // }
}

