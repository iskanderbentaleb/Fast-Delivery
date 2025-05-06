<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            // UserSeeder::class,
            // WilayaSeeder::class,
            // CommunesSeeder::class,
            // LivreurSeeder::class,
            // StatusSeeder::class,
            // ReasonSeeder::class,
        ]);
    }
}
