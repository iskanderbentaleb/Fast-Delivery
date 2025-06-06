<?php

namespace App\Http\Controllers;

use App\Exports\PaymentCalculationExport;
use Inertia\Inertia;
use App\Models\Colie;
use App\Models\Livreur;
use App\Models\Payment;
use App\Models\Communes;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\User;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Facades\Excel;

class PaymentController extends Controller
{
    // Define status constants
    private const STATUS_DELIVERED = '007'; // Livré
    private const STATUS_RETURNED_TO_VENDOR = '011'; // Retourné au vendeur


    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->input('search');

        $payments = Payment::with(['livreur', 'creator'])
            ->when($search, function ($query, $search) {
                $query->whereHas('livreur', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->latest('updated_at')
            ->paginate(8)
            ->appends(['search' => $search]);

        $livreurs = Livreur::select('id', 'name')->get();

        return Inertia::render('admin/payments/index', [
            'payments' => $payments,
            'livreurs' => $livreurs,
            'search' => $search,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $livreurs = Livreur::select('id', 'name')->orderBy('name')->get();

        return Inertia::render('admin/payments/create', [
            'livreurs' => $livreurs
        ]);
    }


    public function calculate(Livreur $livreur = null, bool $internalRequest = false)
    {
        $unpaidColis = Colie::whereNull('id_payment');

        if ($livreur?->id) {
            $unpaidColis->where('livreur_id', $livreur->id);
        }

        $deliveredColis = clone $unpaidColis;
        $returnedColis = clone $unpaidColis;

        $totalClientPayment = (clone $deliveredColis)
            ->where('id_status', self::STATUS_DELIVERED)
            ->selectRaw('SUM(client_amount) as total')
            ->value('total') ?? 0;

        $totalCourierDeliveredPayment = (clone $deliveredColis)
            ->where('id_status', self::STATUS_DELIVERED)
            ->selectRaw('SUM(livreur_amount) as total')
            ->value('total') ?? 0;

        $totalCourierReturnFeePayment = (clone $returnedColis)
            ->where('id_status', self::STATUS_RETURNED_TO_VENDOR)
            ->sum('return_fee');

        $totalCourierNetPayment = $totalCourierDeliveredPayment + $totalCourierReturnFeePayment;
        $totalStorePayment = $totalClientPayment - $totalCourierNetPayment;

        $data = [
            'total_client_payment' => $totalClientPayment,
            'total_courier_delivered_payment' => $totalCourierDeliveredPayment,
            'total_courier_returnfee_payment' => $totalCourierReturnFeePayment,
            'total_courier_net_payment' => $totalCourierNetPayment,
            'total_store_payment' => $totalStorePayment,
        ];

        return $internalRequest ? $data : response()->json($data);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'livreur_id' => 'required|exists:livreurs,id',
        ]);

        $livreur = Livreur::findOrFail($validated['livreur_id']);
        $calculated = $this->calculate($livreur, true);

        DB::transaction(function () use ($livreur, $calculated) {
            $payment = Payment::create([
                'total_client_payment' => $calculated['total_client_payment'],
                'total_return_fee_payment' => $calculated['total_courier_returnfee_payment'],
                'total_courier_delivered_payment' => $calculated['total_courier_delivered_payment'],
                'total_courier_net_payment' => $calculated['total_courier_net_payment'],
                'total_store_payment' => $calculated['total_store_payment'],
                'created_by_id' => auth()->id(),
                'livreur_id' => $livreur->id,
            ]);

            Colie::whereNull('id_payment')
                ->where('livreur_id', $livreur->id)
                ->whereIn('id_status', [
                    self::STATUS_DELIVERED,
                    self::STATUS_RETURNED_TO_VENDOR
                ])
                ->update(['id_payment' => $payment->id]);
        });

        return to_route('admin.payments.create')->with('success', 'Paiement créé avec succès.');
    }


    public function exportCalculation(string $payment_id)
    {
        $payment = Payment::with('colies')->findOrFail($payment_id);

        $filename = 'payment_' . now()->format('Ymd_His') . '.xlsx';

        return Excel::download(new PaymentCalculationExport($payment), $filename);
    }


    public function paymentPrint(string $payment_id)
    {
        $payment = Payment::findOrFail($payment_id); // Find Payment by ID or return 404
        $payment->load(['livreur', 'creator', 'colies.wilaya', 'colies.commune', 'colies.status']);

        $admin = User::findOrFail(auth()->id());
        $admin->load(['wilaya', 'commune']);

        $html = view('pdf.payment', compact('payment' , 'admin'))->render();

        $pdf = Pdf::loadHTML($html)
            ->setPaper('A4', 'portrait')
            ->setOption('defaultFont', 'DejaVu Sans')
            ->setOption('isHtml5ParserEnabled', true)
            ->setOption('isRemoteEnabled', true);

        return $pdf->stream("rapport-paiement-{$payment->id}.pdf");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $payment = Payment::findOrFail($id); // Find Livreur by ID or return 404
        $payment->delete(); // Delete the record
    }
}


