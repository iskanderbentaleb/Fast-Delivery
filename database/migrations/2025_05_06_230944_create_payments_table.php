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
        Schema::create('payments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->decimal('total_client_payment', 10, 2)->default(0);
            $table->decimal('total_return_fee_payment', 10, 2)->default(0);
            $table->decimal('total_courier_delivered_payment', 10, 2)->default(0);
            $table->decimal('total_courier_net_payment', 10, 2)->default(0);
            $table->decimal('total_store_payment', 10, 2)->default(0);

            $table->unsignedBigInteger('created_by_id');
            $table->unsignedBigInteger('livreur_id');
            $table->timestamps();

            $table->foreign('created_by_id')->references('id')->on('users')->onDelete('restrict');
            $table->foreign('livreur_id')->references('id')->on('livreurs')->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
