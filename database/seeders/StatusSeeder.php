<?php

namespace Database\Seeders;

use App\Models\Status;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class StatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $statuses = [
            ['id' => '001', 'status' => 'En préparation', 'backgroundColorHex' => '#1976D2', 'TextColorHex' => '#FFFFFF'], // Blue (info)
            ['id' => '002', 'status' => 'Expédié', 'backgroundColorHex' => '#0288D1', 'TextColorHex' => '#FFFFFF'],       // Light Blue (progress)
            ['id' => '003', 'status' => 'Centre', 'backgroundColorHex' => '#455A64', 'TextColorHex' => '#FFFFFF'],        // Dark gray-blue (neutral)
            ['id' => '004', 'status' => 'Sorti en livraison', 'backgroundColorHex' => '#00796B', 'TextColorHex' => '#FFFFFF'], // Teal (on the way)
            ['id' => '005', 'status' => 'En attente du client', 'backgroundColorHex' => '#FBC02D', 'TextColorHex' => '#000000'], // Yellow (attention)
            ['id' => '006', 'status' => 'Tentative échouée', 'backgroundColorHex' => '#FFA000', 'TextColorHex' => '#000000'], // Orange (warning)
            ['id' => '007', 'status' => 'Livré', 'backgroundColorHex' => '#388E3C', 'TextColorHex' => '#FFFFFF'],         // Green (success)
            ['id' => '008', 'status' => 'Échec livraison', 'backgroundColorHex' => '#D32F2F', 'TextColorHex' => '#FFFFFF'], // Red (failure)
            ['id' => '009', 'status' => 'Retourné vers vendeur', 'backgroundColorHex' => '#C62828', 'TextColorHex' => '#FFFFFF'], // Dark Red
            ['id' => '010', 'status' => 'Retour à retirer', 'backgroundColorHex' => '#E53935', 'TextColorHex' => '#FFFFFF'], // Bright Red
            ['id' => '011', 'status' => 'Retourné au vendeur', 'backgroundColorHex' => '#e52e2e', 'TextColorHex' => '#FFFFFF'], // red
            ['id' => '012', 'status' => 'Echange (pas encore ramassé)', 'backgroundColorHex' => '#616161', 'TextColorHex' => '#FFFFFF'], // Grey (inactive)
            ['id' => '013', 'status' => 'Echange (Ramassé)', 'backgroundColorHex' => '#000000', 'TextColorHex' => '#FFFFFF'], // Purple (custom logic)
            ['id' => '014', 'status' => 'Disparu / Cassé', 'backgroundColorHex' => '#B71C1C', 'TextColorHex' => '#FFFFFF'], // Dark Red for lost/damaged
        ];

        Status::insert($statuses);
    }
}
