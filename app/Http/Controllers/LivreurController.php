<?php

namespace App\Http\Controllers;

use App\Models\Status;
use Inertia\Inertia;
use App\Models\Wilaya;
use App\Models\Livreur;
use App\Models\Payment;
use App\Models\Communes;
use App\Models\CommunePrice;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\PaymentController;
use App\Http\Requests\UpdateCommunePricesRequest;
use App\Models\Colie;

class LivreurController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->input('search');

        $communes = Communes::select('id', 'commune_name', 'wilaya_id')->get();

        $livreurs = Livreur::with(['wilaya'])
            ->with(['communePrices' => function ($query) {
                $query->select('livreur_id', 'commune_id', 'delivery_price', 'return_price');
            }])
            ->when($search, function ($query, $search) {
                // Apply the search filter on multiple fields
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('phone', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhereHas('wilaya', function ($q) use ($search) {
                            $q->where('wilaya_name', 'like', "%{$search}%");
                        });
                });
            })
            ->latest() // Order results by latest
            ->paginate(10) // Paginate results
            ->appends(['search' => $search]); // Keep the search query in pagination links

        return Inertia::render('admin/livreurs/index', [
            'livreurs' => $livreurs,
            'communes' => $communes,
            'search' => $search,
        ]);
    }

    public function dashboard(Livreur $livreur)
    {
        $total_client_payment = Payment::where('livreur_id', $livreur->id)->sum('total_client_payment');
        $total_courier_net_payment = Payment::where('livreur_id', $livreur->id)->sum('total_courier_net_payment');
        $total_store_payment = Payment::where('livreur_id', $livreur->id)->sum('total_store_payment');

        $paymentController = new PaymentController();
        $payment = $paymentController->calculate($livreur, true);

        $total_client_payment_non_paid = $payment['total_client_payment'];
        $total_courier_net_payment_non_paid = $payment['total_courier_net_payment'];
        $total_store_payment_non_paid = $payment['total_store_payment'];

        // Get only statuses relevant for "livraison" display (adjust if needed)
        $livraisonStatuses = Status::whereIn('status', ['Livré', 'Retourné au vendeur'])->get()->keyBy('id');

        // Prepare livraison chart data
        $livraisonData = [];

        foreach ($livraisonStatuses as $id => $status) {
            $count = Colie::where('livreur_id', $livreur->id)
                ->where('id_status', $id)
                ->count();

            $livraisonData[] = [
                'status' => $status->status,
                'id' => $id,
                'commandes' => $count,
                'fill' => $status->backgroundColorHex,
                'textColor' => $status->TextColorHex,
            ];
        }

        // Get all status counts for status distribution chart
        $statusCounts = Colie::selectRaw('id_status, COUNT(*) as count')
            ->where('livreur_id', $livreur->id)
            ->groupBy('id_status')
            ->pluck('count', 'id_status');

        $allStatuses = Status::all()->keyBy('id');

        $statusChartData = [];

        foreach ($statusCounts as $statusId => $count) {
            $status = $allStatuses->get($statusId);
            if ($status) {
                $statusChartData[] = [
                    'status' => $status->status,
                    'commandes' => $count, // renamed from 'visitors'
                    'fill' => $status->backgroundColorHex,
                    'label' => $status->status,
                    'color' => $status->TextColorHex,
                    'id' => $statusId,
                ];
            }
        }

        return response()->json([
            'total_client_payment' => $total_client_payment,
            'total_courier_net_payment' => $total_courier_net_payment,
            'total_store_payment' => $total_store_payment,
            'total_client_payment_non_paid' => $total_client_payment_non_paid,
            'total_courier_net_payment_non_paid' => $total_courier_net_payment_non_paid,
            'total_store_payment_non_paid' => $total_store_payment_non_paid,
            'livraison_data' => $livraisonData,
            'status_chart_data' => $statusChartData,
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
        $livreur = Livreur::with('wilaya')->findOrFail($id);
        $wilayas = Wilaya::all(['id', 'wilaya_name']);

        return inertia('admin/livreurs/edit', [
            'livreur' => $livreur,
            'wilayas' => $wilayas,
        ]);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $livreur = Livreur::findOrFail($id);

        $validated = $request->validate([
            'fullName' => 'required|string|min:2',
            'phone' => 'required|string|min:10',
            'email' => 'required|email|unique:livreurs,email,' . $livreur->id,
            'wilaya' => 'required|exists:wilayas,id',
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
        ]);

        $livreur->name = $validated['fullName'];
        $livreur->phone = $validated['phone'];
        $livreur->email = $validated['email'];
        $livreur->wilaya_id = $validated['wilaya'];

        $livreur->save();

        return redirect()->back();
    }


    /**
     * Update CommunePrice
    */
    public function updateCommunePrice(Request $request, string $id)
    {
        // Validate input manually
        $validator = Validator::make($request->all(), [
            'prices' => 'required|array',
            'prices.*.commune_id' => 'required|integer|exists:communes,id',  // Updated validation rule
            'prices.*.delivery_price' => 'required|numeric',
            'prices.*.return_price' => 'required|numeric',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        // Proceed if validation passes
        $livreur = Livreur::findOrFail($id);
        $pricesArray = $request->input('prices');

        foreach ($pricesArray as $item) {
            // Ensure $item is an array
            if (is_array($item)) {
                CommunePrice::where('livreur_id', $livreur->id)
                    ->where('commune_id', $item['commune_id'])  // Updated to use commune_id
                    ->delete();

                if ($item['delivery_price'] > 0 || $item['return_price'] > 0){
                    CommunePrice::create([
                        'livreur_id' => $livreur->id,
                        'commune_id' => $item['commune_id'],  // Updated to use commune_id
                        'delivery_price' => $item['delivery_price'],
                        'return_price' => $item['return_price'],
                    ]);
                }
            } else {
                // Log or handle the case where $item is not an array
                \Log::error("Invalid item format: ", [$item]);
            }
        }

        return redirect()->back()->with('success', 'Prix mis à jour.');
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
