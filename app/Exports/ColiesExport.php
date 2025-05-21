<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class ColiesExport implements FromCollection, WithMapping, WithHeadings, ShouldAutoSize, WithStyles
{
    protected $colies;

    public function __construct($colies)
    {
        $this->colies = $colies;
    }

    public function collection()
    {
        // Optional: sort by created_at if available
        return $this->colies->sortByDesc('created_at');
    }

    public function map($colie): array
    {
        return [
            $colie->tracking,
            $colie->external_id,
            $colie->client_fullname,
            $colie->client_phone,
            $colie->client_address,
            $colie->products,
            $colie->client_amount,
            $colie->livreur_amount,
            $colie->product_value,
            $colie->return_fee,
            $colie->has_exchange ? 'Oui' : 'Non',
            $colie->wilaya->wilaya_name ?? '',
            $colie->commune->commune_name ?? '',
            $colie->status->status ?? '',
            $colie->livreur->name ?? '',
            $colie->payment ? 'Payé' : 'Non payé',
            $colie->payment ? $colie->id_payment : '' ,
            $colie->created_at ? $colie->created_at->format('Y-m-d H:i') : '',
            $colie->updated_at ? $colie->updated_at->format('Y-m-d H:i') : '',
        ];
    }


    public function headings(): array
    {
        return [
            'Tracking',
            'ID Externe',
            'Nom du Client',
            'Téléphone',
            'Adresse Client',
            'Produits',
            'Montant Client',
            'Montant Livreur',
            'Valeur des Produit(s)',
            'Frais de retour (en cas de retour)',
            'Échange ?',
            'Wilaya',
            'Commune',
            'Statut',
            'Livreur',
            'Paiement',
            'Paiement Id',
            'Date de création',
            'Date de dernière mise à jour',
        ];
    }


    public function styles(Worksheet $sheet)
    {
        return [
            1 => [ // Header row (row 1)
                'font' => [
                    'bold' => true,
                    'size' => 12,
                    'color' => ['rgb' => 'FFFFFF'], // White text
                ],
                'alignment' => [
                    'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER,
                    'vertical' => \PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER,
                ],
                'fill' => [
                    'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                    'startColor' => ['rgb' => '000000'], // Black background
                ],
                'borders' => [
                    'bottom' => [
                        'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
                        'color' => ['rgb' => '000000'],
                    ],
                ],
            ],
        ];
    }


}
