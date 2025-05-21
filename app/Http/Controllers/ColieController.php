<?php

namespace App\Http\Controllers;
use App\Exports\ColiesExport;
use App\Http\Requests\StoreColieRequest;
use App\Http\Requests\UpdateColieRequest;
use App\Models\CommunePrice;
use ArPHP\I18N\Arabic;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use App\Models\Colie;
use App\Models\Communes;
use App\Models\Status;
use App\Models\User;
use App\Models\Wilaya;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class ColieController extends Controller
{
    /**
     * Display a listing of the colies.
     */
    protected function buildColieQuery(Request $request)
    {
    $search = $request->input('search');
    $statusFilters = $request->input('statuses', []);

    return Colie::with(['wilaya', 'commune', 'status', 'payment', 'livreur'])
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
        ->when(!empty($statusFilters), function ($query) use ($statusFilters) {
            $query->whereIn('id_status', $statusFilters);
        })
        ->orderBy('updated_at', 'desc')
        ->orderBy('id', 'desc');
    }

    public function index(Request $request)
    {
        $query = $this->buildColieQuery($request);

        $communes = Communes::select('id', 'commune_name', 'wilaya_id')->get();
        $statuses = Status::all();

        $colies = $query->paginate(10)->appends([
            'search' => $request->input('search'),
            'statuses' => $request->input('statuses', [])
        ]);

        return Inertia::render('admin/colies/index', [
            'colies' => $colies,
            'colies_count' => $colies->total(),
            'communes' => $communes,
            'statuses' => $statuses,
            'search' => $request->input('search'),
            'selectedFilters' => $request->input('statuses', []),
        ]);
    }

    /**
     * Show the form for creating a new colie.
     */
    public function create(Request $request)
     {
         // Fetch all wilayas for the select dropdown
         $wilayas = Wilaya::select('id', 'wilaya_name')->get();

         $communes = collect();
         $livreurs = collect();

         // If wilaya_id is passed in the request, fetch the corresponding communes
         if ($request->filled('wilaya_id')) {
             $communes = Communes::where('wilaya_id', $request->wilaya_id)
                 ->select('id', 'commune_name', 'wilaya_id')
                 ->get();
         }

         // If commune_id is passed in the request, fetch the corresponding livreurs and prices
         if ($request->filled('commune_id')) {
             $livreurs = CommunePrice::with(['livreur:id,name', 'commune'])
                 ->where('commune_id', $request->commune_id)
                 ->get()
                 ->map(function ($item) {
                     return [
                         'livreur_id' => $item->livreur_id,
                         'livreur_name' => $item->livreur->name,
                         'delivery_price' => $item->delivery_price,
                         'return_price' => $item->return_price,
                         'commune_name' => $item->commune->commune_name,
                     ];
                 });
         }

         return Inertia::render('admin/colies/create', [
             'wilayas' => $wilayas,
             'communes' => $communes,
             'livreurs' => $livreurs,
             'selectedWilaya' => $request->wilaya_id,
             'selectedCommune' => $request->commune_id,
         ]);
    }

    /**
     * Store a newly created colie in storage.
     */
    public function store(StoreColieRequest $request)
    {
        $validated = $request->validated();

        try {
            DB::beginTransaction();

            $newId = $this->generateColieId();
            $hasExchange = !empty($validated['exchangeProduct']);
            $tracking = strtoupper(base_convert($newId, 10, 36));

            // Create main colis
            $colie = Colie::create([
                'id' => $newId,
                'tracking' => 'FDY-' . $tracking,
                'client_fullname' => $validated['fullName'],
                'client_phone' => $validated['phone'],
                'client_address' => $validated['adress'],
                'products' => $validated['product'],
                'external_id' => $validated['numero_commande'],
                'client_amount' => $validated['prix_avec_livraison'],
                'livreur_amount' => $validated['delivery_price'],
                'product_value' => $validated['product_value'],
                'return_fee' => $validated['return_price'],
                'has_exchange' => $hasExchange,
                'id_wilaya' => $validated['wilaya'],
                'id_commune' => $validated['commune'],
                'id_status' => '001',
                'id_payment' => null,
                'livreur_id' => $validated['livreur_id'],
            ]);

            // If exchange is requested, create return colis
            if ($hasExchange) {

                $returnId = $this->generateColieId();

                $returnColie = Colie::create([
                    'id' => $returnId,
                    'tracking' => 'ECH-' . $tracking,
                    'client_fullname' => $validated['fullName'], // Your name as receiver
                    'client_phone' => $validated['phone'], // Your phone
                    'client_address' => $validated['adress'], // Your address
                    'products' => $validated['exchangeProduct'],
                    'external_id' => $validated['numero_commande'] . '-RET',
                    'client_amount' => 0, // Typically no amount for return
                    'livreur_amount' => 0, // Typically no amount for return
                    'product_value' => $validated['valueExchangeProduct'],
                    'return_fee' => 0,
                    'has_exchange' => false,
                    'id_wilaya' => Auth::user()->id_wilaya ,
                    'id_commune' => Auth::user()->id_commune ,
                    'id_exchange_return' => $newId, // Link to original colis
                    'id_status' => '012', // Echange (pas encore ramassé)
                    'id_payment' => null,
                    'livreur_id' => $validated['livreur_id'],
                ]);

            }

            DB::commit();

            return redirect()
                ->route('admin.colies')
                ->with('success', 'Colis créé avec succès !' . ($hasExchange ? ' (avec bordereau de retour)' : ''));

            } catch (\Exception $e) {
                DB::rollBack();

                // Log the error with full details
                Log::error('Erreur lors de la création du colis', [
                    'message' => $e->getMessage(),
                    'trace' => $e->getTraceAsString(),
                    'file' => $e->getFile(),
                    'line' => $e->getLine(),
                ]);

                return back()
                    ->withInput()
                    ->with('error', 'Une erreur est survenue lors de la création du colis: ' . $e->getMessage());
            }
    }
    /**
     * Generate a unique colie ID.
     *
     * @return string
    */
    protected function generateColieId(): string
    {
        // 000-12-31-001 → 000366001 (numeric) 000=2025-2025 || max id is : 999366999
        $baseYear = User::orderBy('created_at')->value('created_at')?->format('Y') ?? now()->year;

        $currentYear = (int) date('Y');
        $yearDiff = str_pad((string) ($currentYear - $baseYear), 3, '0', STR_PAD_LEFT);

        $dayOfYear = str_pad((string)(date('z') + 1), 3, '0', STR_PAD_LEFT);

        // Get last colie of today
        $todayStart = now()->startOfDay();
        $todayEnd = now()->endOfDay();

        $lastColie = Colie::whereBetween('created_at', [$todayStart, $todayEnd])
            ->orderByDesc('id')
            ->first();

        $lastSequence = $lastColie
            ? (int) substr($lastColie->id, -3)
            : 0;

        $sequence = str_pad((string) ($lastSequence + 1), 3, '0', STR_PAD_LEFT);

        return $yearDiff . $dayOfYear . $sequence;
    }

    public function edit(Request $request, Colie $colie)
    {
        $wilayas = Wilaya::select('id', 'wilaya_name')->get();
        $communes = collect();
        $livreurs = collect();

        // Load communes if wilaya is set on the colie
        if ($colie->id_wilaya) {
            $communes = Communes::where('wilaya_id', $colie->id_wilaya)
                ->select('id', 'commune_name', 'wilaya_id')
                ->get();
        }

        // Load livreurs if commune is set on the colie
        if ($colie->id_commune) {
            $livreurs = CommunePrice::with(['livreur:id,name', 'commune'])
                ->where('commune_id', $colie->id_commune)
                ->get()
                ->map(function ($item) {
                    return [
                        'livreur_id' => $item->livreur_id,
                        'livreur_name' => $item->livreur->name,
                        'delivery_price' => $item->delivery_price,
                        'return_price' => $item->return_price,
                        'commune_name' => $item->commune->commune_name,
                    ];
                });
        }

        return Inertia::render('admin/colies/edit', [
            'colie' => $colie->load('exchangedColies'),
            'wilayas' => $wilayas,
            'communes' => $communes,
            'livreurs' => $livreurs,
            'selectedWilaya' => $colie->id_wilaya,
            'selectedCommune' => $colie->id_commune,
        ]);
    }

    public function update(UpdateColieRequest $request, Colie $colie)
    {
        $validated = $request->validated();
        $hasExchange = !empty($validated['exchangeProduct']);


        if ($colie->id_status !== '001' || $colie->id_payment !== null){ // if not "En Préparation"
            return redirect()->back()->with('error', 'Ce colis ne peut pas être modifé .');
        }

        try {
            DB::beginTransaction();

            // Update main colis
            $colie->update([
                'client_fullname' => $validated['fullName'],
                'client_phone' => $validated['phone'],
                'client_address' => $validated['adress'],
                'products' => $validated['product'],
                'external_id' => $validated['numero_commande'],
                'client_amount' => $validated['prix_avec_livraison'],
                'livreur_amount' => $validated['delivery_price'],
                'product_value' => $validated['product_value'],
                'return_fee' => $validated['return_price'],
                'has_exchange' => $hasExchange,
                'id_wilaya' => $validated['wilaya'],
                'id_commune' => $validated['commune'],
                'id_payment' => $validated['id_payment'] ?? null,
                'livreur_id' => $validated['livreur_id'],
            ]);

            // Check if there’s an existing exchange colis
            $exchangeColie = Colie::where('id_exchange_return', $colie->id)->first();

            if ($hasExchange) {
                if ($exchangeColie) {
                    // Update existing exchange colie
                    $exchangeColie->update([
                        'client_fullname' => $validated['fullName'], // Your name as receiver
                        'client_phone' => $validated['phone'], // Your phone
                        'client_address' => $validated['adress'], // Your address
                        'external_id' => $validated['numero_commande'] . '-RET',
                        'client_amount' => 0, // Typically no amount for return
                        'livreur_amount' => 0, // Typically no amount for return
                        'return_fee' => 0,
                        'has_exchange' => false,
                        'id_wilaya' => Auth::user()->id_wilaya ,
                        'id_commune' => Auth::user()->id_commune ,
                        'products' => $validated['exchangeProduct'],
                        'product_value' => $validated['valueExchangeProduct'],
                        'livreur_id' => $validated['livreur_id'],
                    ]);
                } else {
                    // Create new exchange colie
                    $returnId = $this->generateColieId();
                    $tracking = strtoupper(base_convert($colie->id, 10, 36));

                    Colie::create([
                        'id' => $returnId,
                        'tracking' => 'ECH-' . $tracking,
                        'client_fullname' => $validated['fullName'],
                        'client_phone' => $validated['phone'],
                        'client_address' => $validated['adress'],
                        'products' => $validated['exchangeProduct'],
                        'external_id' => $validated['numero_commande'] . '-RET',
                        'client_amount' => 0,
                        'livreur_amount' => 0,
                        'product_value' => $validated['valueExchangeProduct'],
                        'return_fee' => 0,
                        'has_exchange' => false,
                        'id_wilaya' => Auth::user()->id_wilaya,
                        'id_commune' => Auth::user()->id_commune,
                        'id_exchange_return' => $colie->id,
                        'id_status' => '012',
                        'id_payment' => null,
                        'livreur_id' => $validated['livreur_id'],
                    ]);
                }
            } elseif ($exchangeColie) {
                // Delete old exchange colie if user removed it
                $exchangeColie->delete();
            }

            DB::commit();

            return redirect()
                ->route('admin.colies')
                ->with('success', 'Colis mis à jour avec succès !');

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Erreur lors de la mise à jour du colis', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);

            return back()
                ->withInput()
                ->with('error', 'Une erreur est survenue lors de la mise à jour du colis: ' . $e->getMessage());
        }
    }

    public function destroy(Colie $colie)
    {
        if (
            $colie->id_status !== '001' || // if (En préparation) can delete  else not
            $colie->id_payment !== null || // payé can delete
            $colie->id_exchange_return !== null // if retour echange can not delete
        ) {
            return redirect()->back()->with('error', 'Ce colis ne peut pas être supprimé. Il est payé, retourné ou a un statut non autorisé.');
        }

        $colie->delete();
        return redirect()->route('admin.colies')->with('success', 'Colis supprimé avec succès.');
    }

    public function generateBordereau(Colie $colie)
    {
        $colie->load([
            'wilaya',
            'commune',
            'status',
            'payment',
            'exchangeReturn',
            'exchangedColies',
            'livreur',
        ]);

        // Render the Blade view to HTML
        $html = view('pdf.bordereau', compact('colie'))->render();

        // Arabic shaping
        $arabic = new Arabic();
        $positions = $arabic->arIdentify($html);

        for ($i = count($positions) - 1; $i >= 0; $i -= 2) {
            $substr = substr($html, $positions[$i - 1], $positions[$i] - $positions[$i - 1]);
            $shaped = $arabic->utf8Glyphs($substr);
            $html = substr_replace($html, $shaped, $positions[$i - 1], $positions[$i] - $positions[$i - 1]);
        }

        // Generate the PDF from the processed HTML
        $pdf = Pdf::loadHTML($html)
            ->setPaper('A4', 'portrait')
            ->setOption('defaultFont', value: 'DejaVu Sans')
            ->setOption('isHtml5ParserEnabled', true)
            ->setOption('isRemoteEnabled', true);

        return $pdf->stream("bordereau-{$colie->tracking}.pdf");
    }

    public function generateMultipleBordereaux(Request $request)
    {
        $request->validate([
            'selectedIds' => 'required|array',
            'selectedIds.*' => 'string|max:255',
            'search' => 'nullable|string|max:255',
            'statuses' => 'nullable|array',
            'statuses.*' => 'string|exists:statuses,id',
        ]);

        $selectedIds = $request->input('selectedIds', []);

        if (empty($selectedIds)) {
            return back()->with('error', 'Aucun colis sélectionné.');
        }

        // Fetch colies
        if ($selectedIds[0] === 'ALL') {
            $query = $this->buildColieQuery($request);
            $colies = $query->limit(200)->get();
        } else {
            $colies = Colie::with([
                'wilaya', 'commune', 'status', 'payment', 'exchangeReturn', 'exchangedColies', 'livreur',
            ])->whereIn('id', $selectedIds)->get();
        }

        if ($colies->isEmpty()) {
            return back()->with('error', 'Aucun colis trouvé.');
        }

        // Render view to HTML
        $html = view('pdf.bordereaux-multiple', compact('colies'))->render();

        // Arabic shaping
        $arabic = new Arabic();
        $positions = $arabic->arIdentify($html);

        for ($i = count($positions) - 1; $i >= 0; $i -= 2) {
            $substr = substr($html, $positions[$i - 1], $positions[$i] - $positions[$i - 1]);
            $shaped = $arabic->utf8Glyphs($substr);
            $html = substr_replace($html, $shaped, $positions[$i - 1], $positions[$i] - $positions[$i - 1]);
        }

        // Generate the PDF
        $pdf = Pdf::loadHTML($html)
            ->setPaper('A4', 'portrait')
            ->setOption('defaultFont', 'DejaVu Sans')
            ->setOption('isHtml5ParserEnabled', true)
            ->setOption('isRemoteEnabled', true);

        return $pdf->stream("bordereaux-multiples.pdf");
    }

    public function export(Request $request)
    {
        $request->validate([
            'selectedIds' => 'required|array',
            'selectedIds.*' => 'string|max:255',
            'search' => 'nullable|string|max:255',
            'statuses' => 'nullable|array',
            'statuses.*' => 'string|exists:statuses,id',
        ]);

        $selectedIds = $request->input('selectedIds', []);

        if (empty($selectedIds)) {
            return back()->with('error', 'Aucun colis sélectionné.');
        }

        // Fetch colies
        if ($selectedIds[0] === 'ALL') {
            $query = $this->buildColieQuery($request)
                ->orderBy('created_at', 'desc');

            $colies = $query->get();
        } else {
            $colies = Colie::with([
                'wilaya', 'commune', 'status', 'payment', 'exchangeReturn', 'exchangedColies', 'livreur',
            ])
            ->whereIn('id', $selectedIds)
            ->orderBy('created_at', 'desc')
            ->get();
        }

        if ($colies->isEmpty()) {
            return back()->with('error', 'Aucun colis trouvé.');
        }

        return Excel::download(new ColiesExport($colies), 'colies.xlsx');
    }


}

