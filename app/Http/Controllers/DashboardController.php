<?php

namespace App\Http\Controllers;

use App\Models\Colie;
use App\Models\Payment;
use App\Models\Status;
use Inertia\Inertia;

class DashboardController extends Controller
{
  public function dashboard()
    {
        // Existing payment calculations
        $paymentController = new PaymentController();
        $payment = $paymentController->calculate(null, true);

        $total_client_payment_non_paid = $payment['total_client_payment'];
        $total_courier_net_payment_non_paid = $payment['total_courier_net_payment'];
        $total_store_payment_non_paid = $payment['total_store_payment'];

        $total_client_payment = Payment::sum('total_client_payment');
        $total_courier_net_payment = Payment::sum('total_courier_net_payment');
        $total_store_payment = Payment::sum('total_store_payment');

        // Get the first created_at date to determine the starting year
        $firstColisYear = Colie::orderBy('created_at')->value('created_at');
        $startYear = $firstColisYear ? $firstColisYear->year : now()->year;
        $currentYear = now()->year;

        // Generate years array from startYear to currentYear
        $years = [];
        for ($year = $startYear; $year <= $currentYear; $year++) {
            $years[] = $year;
        }

        $livreStatus = Status::where('status', 'Livré')->first();
        $retourneStatus = Status::where('status', 'Retourné au vendeur')->first();

        // Get monthly data for all years
        $rawMonthlyData = Colie::selectRaw('
                DATE_FORMAT(created_at, "%Y-%m") as month,
                YEAR(created_at) as year,
                COUNT(*) as total,
                SUM(CASE WHEN id_status = ? THEN 1 ELSE 0 END) as livre,
                SUM(CASE WHEN id_status = ? THEN 1 ELSE 0 END) as retourne
            ', [$livreStatus->id, $retourneStatus->id])
            ->groupBy('month', 'year')
            ->orderBy('month')
            ->get();

        // Create complete monthly data with all months for each year
        $completeMonthlyData = [];
        $yearlyTotals = []; // New array to store yearly totals

        foreach ($years as $year) {
            $yearlyTotals[$year] = [
                'total' => 0,
                'livré' => 0,
                'retourné' => 0
            ];

            for ($month = 1; $month <= 12; $month++) {
                $monthKey = sprintf('%04d-%02d', $year, $month);
                $data = $rawMonthlyData->firstWhere('month', $monthKey);

                $monthData = [
                    'date' => $monthKey,
                    'total' => $data ? $data->total : 0,
                    'livré' => $data ? $data->livre : 0,
                    'retourné' => $data ? $data->retourne : 0,
                ];

                $completeMonthlyData[] = $monthData;

                // Accumulate yearly totals
                $yearlyTotals[$year]['total'] += $monthData['total'];
                $yearlyTotals[$year]['livré'] += $monthData['livré'];
                $yearlyTotals[$year]['retourné'] += $monthData['retourné'];
            }
        }


        // Taux de livraison
        $livraisonStatuses = Status::whereIn('status', ['Livré', 'Retourné au vendeur'])->get()->keyBy('id');
        $taux_livraison = [];
        foreach ($livraisonStatuses as $id => $status) {
            $count = Colie::where('id_status', $id)->count();

            $taux_livraison[] = [
                'id' => $id,
                'status' => $status->status,
                'commandes' => $count,
                'fill' => $status->backgroundColorHex,
                'textColor' => $status->TextColorHex,
            ];
        }

        // Répartition des statuts
        $statusCounts = Colie::selectRaw('id_status, COUNT(*) as count')
            ->groupBy('id_status')
            ->pluck('count', 'id_status');

        $allStatuses = Status::all()->keyBy('id');

        $repartition_des_statuts = [];
        foreach ($statusCounts as $statusId => $count) {
            $status = $allStatuses->get($statusId);
            if ($status) {
                $repartition_des_statuts[] = [
                    'status' => $status->status,
                    'commandes' => $count,
                    'fill' => $status->backgroundColorHex,
                    'label' => $status->status,
                    'color' => $status->TextColorHex,
                    'id' => $statusId,
                ];
            }
        }

        return Inertia::render('admin/dashboard/index', [
                'total_client_payment_non_paid' => $total_client_payment_non_paid,
                'total_courier_net_payment_non_paid' => $total_courier_net_payment_non_paid,
                'total_store_payment_non_paid' => $total_store_payment_non_paid,
                'total_client_payment' => $total_client_payment,
                'total_courier_net_payment' => $total_courier_net_payment,
                'total_store_payment' => $total_store_payment,
                'taux_livraison' => $taux_livraison,
                'repartition_des_statuts' => $repartition_des_statuts,
                'chartData' => $completeMonthlyData,
                'yearlyTotals' => $yearlyTotals, // Add this line
                'availableYears' => $years,
                'currentYear' => $currentYear,
            ]);
  }
}
