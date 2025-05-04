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
        Schema::create('commune_prices', function (Blueprint $table) {
            $table->unsignedBigInteger('livreur_id');
            $table->unsignedInteger('commune_id');
            $table->decimal('delivery_price', 10, 2);
            $table->decimal('return_price', 10, 2);

            $table->primary(['livreur_id', 'commune_id']);

            $table->foreign('livreur_id')
                  ->references('id')->on('livreurs')
                  ->onDelete('cascade');

            $table->foreign('commune_id')
                  ->references('id')->on('communes')
                  ->onDelete('cascade');
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('commune_prices');
    }
};
