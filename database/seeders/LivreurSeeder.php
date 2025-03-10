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
                'id' => Str::uuid(),
                'wilaya_name' => 'Alger', // Default Wilaya
            ]);
        }

        // Insert sample Livreurs
        DB::table('livreurs')->insert([
            [
                'name' => 'Ahmed Bouzid',
                'phone' => '0555123456',
                'wilaya_id' => $wilaya->id,
                'email' => 'iskanderboss1999@gmail.com',
                'email_verified_at' => now(),
                'password' => Hash::make('iskanderboss1999@gmail.com'), // Hashed password
                'remember_token' => Str::random(10),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
