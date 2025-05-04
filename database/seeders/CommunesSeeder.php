<?php

namespace Database\Seeders;

use App\Models\Wilaya;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CommunesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Find Wilaya 'Alger' (assuming it's already seeded)
        $wilaya = Wilaya::where('wilaya_name', 'Alger')->first();

        if (!$wilaya) {
            $wilaya = Wilaya::create([
                'id' => 16,
                'wilaya_name' => 'Alger',
            ]);
        }

        $communes = [
            ['id' => 16001, 'name' => 'Alger-Centre'],
            ['id' => 16002, 'name' => 'Sidi M\'Hamed'],
            ['id' => 16003, 'name' => 'El Madania'],
            ['id' => 16004, 'name' => 'Belouizdad'],
            ['id' => 16005, 'name' => 'Bab El Oued'],
            ['id' => 16006, 'name' => 'Bologhine'],
            ['id' => 16007, 'name' => 'Casbah'],
            ['id' => 16008, 'name' => 'Oued Koriche'],
            ['id' => 16009, 'name' => 'Bir Mourad Raïs'],
            ['id' => 16010, 'name' => 'El Biar'],
            ['id' => 16011, 'name' => 'Bouzareah'],
            ['id' => 16012, 'name' => 'Birkhadem'],
            ['id' => 16013, 'name' => 'El Harrach'],
            ['id' => 16014, 'name' => 'Baraki'],
            ['id' => 16015, 'name' => 'Oued Smar'],
            ['id' => 16016, 'name' => 'Bachdjerrah'],
            ['id' => 16017, 'name' => 'Hussein Dey'],
            ['id' => 16018, 'name' => 'Kouba'],
            ['id' => 16019, 'name' => 'Bourouba'],
            ['id' => 16020, 'name' => 'Dar El Beïda'],
            ['id' => 16021, 'name' => 'Bab Ezzouar'],
            ['id' => 16022, 'name' => 'Ben Aknoun'],
            ['id' => 16023, 'name' => 'Dely Ibrahim'],
            ['id' => 16024, 'name' => 'Hammamet'],
            ['id' => 16025, 'name' => 'Raïs Hamidou'],
            ['id' => 16026, 'name' => 'Djasr Kasentina'],
            ['id' => 16027, 'name' => 'El Mouradia'],
            ['id' => 16028, 'name' => 'Hydra'],
            ['id' => 16029, 'name' => 'Mohammadia'],
            ['id' => 16030, 'name' => 'Bordj El Kiffan'],
            ['id' => 16031, 'name' => 'El Magharia'],
            ['id' => 16032, 'name' => 'Beni Messous'],
            ['id' => 16033, 'name' => 'Les Eucalyptus'],
            ['id' => 16034, 'name' => 'Birtouta'],
            ['id' => 16035, 'name' => 'Tessala El Merdja'],
            ['id' => 16036, 'name' => 'Ouled Chebel'],
            ['id' => 16037, 'name' => 'Sidi Moussa'],
            ['id' => 16038, 'name' => 'Aïn Taya'],
            ['id' => 16039, 'name' => 'Bordj El Bahri'],
            ['id' => 16040, 'name' => 'El Marsa'],
            ['id' => 16041, 'name' => 'H\'Raoua'],
            ['id' => 16042, 'name' => 'Rouïba'],
            ['id' => 16043, 'name' => 'Reghaïa'],
            ['id' => 16044, 'name' => 'Aïn Benian'],
            ['id' => 16045, 'name' => 'Staoueli'],
            ['id' => 16046, 'name' => 'Zeralda'],
            ['id' => 16047, 'name' => 'Mahelma'],
            ['id' => 16048, 'name' => 'Rahmania'],
            ['id' => 16049, 'name' => 'Souidania'],
            ['id' => 16050, 'name' => 'Cheraga'],
            ['id' => 16051, 'name' => 'Ouled Fayet'],
            ['id' => 16052, 'name' => 'El Achour'],
            ['id' => 16053, 'name' => 'Draria'],
            ['id' => 16054, 'name' => 'Douera'],
            ['id' => 16055, 'name' => 'Baba Hassen'],
            ['id' => 16056, 'name' => 'Khraicia'],
            ['id' => 16057, 'name' => 'Saoula'],
        ];

        foreach ($communes as $commune) {
            DB::table('communes')->insert([
                'id' => $commune['id'],
                'commune_name' => $commune['name'],
                'wilaya_id' => 16, // Algiers
            ]);
        }

    }
}
