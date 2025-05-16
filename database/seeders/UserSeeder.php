<?php

namespace Database\Seeders;


use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('users')->insert([
            [
                'name' => 'BENTALEB ISKANDER',
                'email' => 'iskanderboss1999@gmail.com',
                'storename' => 'BEBE MODE',
                'phone' => '0770563130',
                'address' => 'Villa N94',
                'id_wilaya' => 16,
                'id_commune' => 16017,
                'email_verified_at' => Carbon::now(),
                'password' => Hash::make('iskanderboss1999@gmail.com'),
                'remember_token' => Str::random(10),
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ]);
    }
}
