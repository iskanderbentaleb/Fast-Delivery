<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\Wilaya;

class LivreurSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        // Retrieve a random Wilaya (ensure Wilayas are seeded first)
        $wilaya = Wilaya::inRandomOrder()->first();

        if (!$wilaya) {
            // If no Wilaya exists, create one
            $wilaya = Wilaya::create([
                'id' => 16,
                'wilaya_name' => 'Alger', // Default Wilaya
            ]);
        }

        // Insert sample Livreurs
        DB::table('livreurs')->insert([
            [
                'name' => 'Test Livreur',
                'phone' => '0000000000',
                'wilaya_id' => $wilaya->id,
                'email' => 'test-livreur@gmail.com',
                'email_verified_at' => now(),
                'password' => Hash::make('test-livreur@gmail.com'), // Hashed password
                'remember_token' => Str::random(10),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
