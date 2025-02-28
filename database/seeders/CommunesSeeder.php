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
                'id' => Str::uuid(),
                'wilaya_name' => 'Alger',
            ]);
        }

        $communes = [
            'Alger-Centre', 'Sidi M\'Hamed', 'El Madania', 'Belouizdad', 'Bab El Oued',
            'Bologhine', 'Casbah', 'Oued Koriche', 'Bir Mourad Raïs', 'El Biar',
            'Bouzareah', 'Birkhadem', 'El Harrach', 'Baraki', 'Oued Smar',
            'Bachdjerrah', 'Hussein Dey', 'Kouba', 'Bourouba', 'Dar El Beïda',
            'Bab Ezzouar', 'Ben Aknoun', 'Dely Ibrahim', 'Hammamet', 'Raïs Hamidou',
            'Djasr Kasentina', 'El Mouradia', 'Hydra', 'Mohammadia', 'Bordj El Kiffan',
            'El Magharia', 'Beni Messous', 'Les Eucalyptus', 'Birtouta', 'Tessala El Merdja',
            'Ouled Chebel', 'Sidi Moussa', 'Aïn Taya', 'Bordj El Bahri', 'El Marsa',
            'H\'Raoua', 'Rouïba', 'Reghaïa', 'Aïn Benian', 'Staoueli', 'Zeralda',
            'Mahelma', 'Rahmania', 'Souidania', 'Cheraga', 'Ouled Fayet', 'El Achour',
            'Draria', 'Douera', 'Baba Hassen', 'Khraicia', 'Saoula'
        ];

        foreach ($communes as $commune) {
            DB::table('communes')->insert([
                'id' => Str::uuid(),
                'commune_name' => $commune,
                'wilaya_id' => $wilaya->id,
            ]);
        }
    }
}
