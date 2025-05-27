<?php

namespace App\Http\Controllers;

use App\Models\Colie;
use App\Models\colieHistory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class ColieHistoryController extends Controller
{

    public function getStatusHistory($tracking)
    {
        // Validate tracking format
        if (!preg_match('/^(FDY|ECH)-[A-Z0-9]{1,7}$/i', $tracking)) {
            return response()->json([
                'success' => false,
                'message' => 'Format de suivi invalide'
            ], 400);
        }

        try {
            // Get the colie with its history and relationships
            $colie = Colie::with([
                'status',
                'histories' => function($query) {
                    $query->orderBy('created_at', 'desc')
                        ->with(['status', 'reason', 'livreur']);
                }
            ])->where('tracking', $tracking)->first();

            if (!$colie) {
                return response()->json([
                    'success' => false,
                    'message' => 'Colis non trouvé'
                ], 404);
            }

            // Format the history data
            $history = $colie->histories->map(function($item) {
                return [
                    'status' => $item->status->status,
                    'status_color' => $item->status->background_color_hex,
                    'status_text_color' => $item->status->text_color_hex,
                    'date' => $item->created_at->format('d/m/Y H:i'),
                    'reason' => $item->reason?->reason,
                    'livreur' => $item->livreur?->name,
                    'note' => $item->note
                ];
            });

            return response()->json([
                'success' => true,
                'data' => [
                    'current_status' => [
                        'status' => $colie->status->status,
                        'backgroundColorHex' => $colie->status->background_color_hex,
                        'TextColorHex' => $colie->status->text_color_hex
                    ],
                    'history' => $history
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur serveur',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function checkColieExist(Request $request)
    {
        $request->validate([
            'tracking' => 'required|string',
        ]);

        $colie = Colie::where('tracking', $request->tracking)->where('id_payment' , null) ;
        $exists = $colie->exists();

        return response()->json([
            'tracking' => $request->tracking,
            'exists' => $exists,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'tracking'    => ['required', 'string', Rule::exists('colies', 'tracking')],
            'id_status'   => 'required|string|exists:statuses,id',
            'id_reason'   => 'nullable|string|exists:reasons,id',
            'id_livreur'  => 'nullable|integer|exists:livreurs,id',
            'note'        => 'nullable|string',
        ]);

        // Start a database transaction to ensure data consistency
        DB::beginTransaction();

        try {
            // Retrieve the colie record based on the tracking number
            $colie = Colie::where('tracking', $validated['tracking'])->firstOrFail();

            // Update the colie's status
            $colie->update([
                'id_status' => $validated['id_status'],
                // You can update other fields here if needed
            ]);

            // Check if payment exists (id_payment is not null)
            if ($colie->id_payment !== null) {
                throw new \Exception('Le paiement n\'a pas été effectué pour ce colis');
                return '';
            }

            // Create the history record using the colie's ID
            $history = ColieHistory::create([
                'id_colie'    => $colie->id,
                'id_status'   => $validated['id_status'],
                'id_reason'   => $validated['id_reason'] ?? null,
                'id_livreur'  => $validated['id_livreur'] ?? null,
                'note'        => $validated['note'] ?? null,
            ]);

            // Commit the transaction
            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Statut du colis et historique mis à jour avec succès.',
                'data'    => [
                    'history' => $history,
                    'colie'   => $colie->fresh() // Return the updated colie data
                ]
            ], 201);

        } catch (\Exception $e) {
            // Rollback the transaction on error
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Une erreur est survenue lors de la mise à jour.',
                'error'   => $e->getMessage()
            ], 500);
        }
    }
}
