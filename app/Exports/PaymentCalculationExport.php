<?php
namespace App\Exports;

use App\Models\Payment;
use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;

class PaymentCalculationExport implements FromArray, WithHeadings, WithStyles, WithColumnWidths, WithEvents
{
    protected $payment;

    public function __construct(Payment $payment)
    {
        $this->payment = $payment;
    }

    public function headings(): array
    {
        return [
            array_merge(['RAPPORT DE PAIEMENT - SYNTHÈSE'], array_fill(1, 10, '')),
            [],
            array_merge(['INFORMATIONS GÉNÉRALES'], array_fill(1, 10, '')),
            [
                'Référence Paiement', 'Date Paiement', 'Créé par', 'Livreur',
                '', '', '', '', '', '', ''
            ],
            [
                $this->payment->id,
                $this->payment->created_at->format('d/m/Y H:i'),
                $this->payment->creator->name ?? 'N/A',
                $this->payment->livreur->name ?? 'N/A',
                '', '', '', '', '', '', ''
            ],
            [],
            array_merge(['RÉCAPITULATIF FINANCIER'], array_fill(1, 10, '')),
            [
                'Montant Client', 'Frais Retour', 'Livreur (Livrés)',
                'Net Livreur', 'Magasin',
                '', '', '', '', '', ''
            ],
            [
                number_format($this->payment->total_client_payment, 2) . ' DZD',
                number_format($this->payment->total_return_fee_payment, 2) . ' DZD',
                number_format($this->payment->total_courier_delivered_payment, 2) . ' DZD',
                number_format($this->payment->total_courier_net_payment, 2) . ' DZD',
                number_format($this->payment->total_store_payment, 2) . ' DZD',
                '', '', '', '', '', ''
            ],
            [],
            array_merge(['DÉTAIL DES COLIS'], array_fill(1, 10, '')),
            [
                'Tracking', 'Statut', 'Client (DZD)', 'Livreur (DZD)',
                'Frais Retour', 'Magasin (DZD)', 'Nom Client', 'Téléphone',
                'Wilaya', 'Commune', 'Date Création'
            ],
        ];
    }


    public function array(): array
    {
        return $this->payment->colies->map(function ($colie) {
            $storeAmount = $colie->client_amount - ($colie->livreur_amount + $colie->return_fee);

            return [
                $colie->tracking,
                $colie->status->status ?? 'N/A',
                number_format($colie->client_amount, 2),
                number_format($colie->livreur_amount, 2),
                number_format($colie->return_fee, 2),
                number_format(max($storeAmount, 0), 2),
                $colie->client_fullname,
                $colie->client_phone,
                $colie->wilaya->wilaya_name ?? 'N/A',
                $colie->commune->commune_name ?? 'N/A',
                $colie->created_at->format('d/m/Y H:i'),
            ];
        })->toArray();
    }

    public function styles(Worksheet $sheet)
    {
        $colisStartRow = 13;
        $colisEndRow = $colisStartRow + count($this->payment->colies);

        $sheet->getParent()->getDefaultStyle()->applyFromArray([
            'font' => ['name' => 'Calibri', 'size' => 10],
            'alignment' => ['vertical' => Alignment::VERTICAL_CENTER],
        ]);

        $styles = [
            1 => [
                'font' => ['bold' => true, 'size' => 16, 'color' => ['rgb' => 'FFFFFF']],
                'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER],
                'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => '1F4E78']],
            ],
            3 => [
                'font' => ['bold' => true, 'size' => 12, 'color' => ['rgb' => 'FFFFFF']],
                'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => '1F4E78']],
            ],
            7 => [
                'font' => ['bold' => true, 'size' => 12, 'color' => ['rgb' => 'FFFFFF']],
                'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => '1F4E78']],
            ],
            11 => [
                'font' => ['bold' => true, 'color' => ['rgb' => 'FFFFFF']],
                'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => '4472C4']],
            ],
            4 => [
                'font' => ['bold' => true],
                'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => 'D9E1F2']],
            ],
            8 => [
                'font' => ['bold' => true],
                'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER],
                'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => 'BDD7EE']],
                'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN]],
            ],
            9 => [
                'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER],
                'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => 'E7E6E6']],
                'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN]],
            ],
            12 => [
                'font' => ['bold' => true, 'color' => ['rgb' => 'FFFFFF']],
                'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER],
                'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => '2F5597']],
                'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN]],
            ],
        ];

        // Zebra striping
        for ($i = $colisStartRow; $i <= $colisEndRow; $i++) {
            if ($i % 2 === 0) {
                $styles[$i] = [
                    'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => 'F2F2F2']],
                ];
            }
        }

        $styles["A{$colisStartRow}:K{$colisEndRow}"] = [
            'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN]],
            'alignment' => ['wrapText' => true, 'horizontal' => Alignment::HORIZONTAL_LEFT],
        ];

        return $styles;
    }
    public function columnWidths(): array
    {
        return [
            'A' => 20, // tracking or important labels
            'B' => 20, // status or date
            'C' => 15,
            'D' => 15,
            'E' => 15,
            'F' => 15,
            'G' => 25,
            'H' => 18,
            'I' => 18,
            'J' => 18,
            'K' => 22, // date/time or long text
        ];
    }


    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {
                $sheet = $event->sheet;
                $colisStartRow = 13;
                $colisEndRow = $colisStartRow + count($this->payment->colies);
                $lastColumn = 'K';

                $sheet->mergeCells("A1:{$lastColumn}1");
                $sheet->mergeCells("A3:{$lastColumn}3");
                $sheet->mergeCells("A7:{$lastColumn}7");
                $sheet->mergeCells("A11:{$lastColumn}11");

                $sheet->getRowDimension(1)->setRowHeight(30);

                $sheet->freezePane("A{$colisStartRow}");

                $sheet->getStyle("F{$colisStartRow}:F{$colisEndRow}")
                    ->getNumberFormat()
                    ->setFormatCode('[Red][<0]#,##0.00;#,##0.00');

                $sheet->setAutoFilter("A12:{$lastColumn}12");
            },
        ];
    }
}
