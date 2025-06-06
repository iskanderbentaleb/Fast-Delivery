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
                'name' => 'User Admin',
                'email' => 'test@gmail.com',
                'storename' => 'STORE NAME',
                'phone' => '0000000000',
                'address' => 'Villa N94',
                'id_wilaya' => 16, // alger
                'id_commune' => 16001, // Alger-Centre
                'email_verified_at' => Carbon::now(),
                'password' => Hash::make('test@gmail.com'), // set your password here ( i put the email )
                'remember_token' => Str::random(10),
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ]);
    }
}
