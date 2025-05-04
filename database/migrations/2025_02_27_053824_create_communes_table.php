<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('communes', function (Blueprint $table) {
            $table->unsignedInteger('id', false)->primary();
            $table->string('commune_name');
            $table->unsignedTinyInteger('wilaya_id'); // Foreign key to Wilaya

            // Foreign key constraint
            $table->foreign('wilaya_id')->references('id')->on('wilayas')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('communes');
    }
};
