<?php

namespace Database\Seeders;

use App\Models\Reason;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ReasonSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $reasons = [
            ['id' => '001', 'reason' => 'Téléphone injoignable'],
            ['id' => '002', 'reason' => 'Client ne répond pas'],
            ['id' => '003', 'reason' => 'Faux numéro'],
            ['id' => '004', 'reason' => 'Client absent (reporté)'],
            ['id' => '005', 'reason' => 'Client absent (échoué)'],
            ['id' => '006', 'reason' => 'Annulé par le client'],
            ['id' => '007', 'reason' => 'Commande double'],
            ['id' => '008', 'reason' => "Le client n'a pas commandé"],
            ['id' => '009', 'reason' => 'Produit erroné'],
            ['id' => '010', 'reason' => 'Produit manquant'],
            ['id' => '011', 'reason' => 'Produit cassé ou défectueux'],
            ['id' => '012', 'reason' => 'Client incapable de payer'],
            ['id' => '013', 'reason' => 'Wilaya erronée'],
            ['id' => '014', 'reason' => 'Commune erronée'],
        ];

        Reason::insert($reasons);
    }
}
