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
        Schema::create('colies', function (Blueprint $table) {
            $table->string('id', length: 9)->primary(); // 000-12-31-001 → 000366001 (numeric) 000=2025-2025 || max id is : 999366999
            $table->string('tracking', 10)->unique(); // → prefix FDY(ECH)-7LFL (Base36). || max is : LFLZ7R
            $table->string('client_fullname', 50);
            $table->string('client_phone' , 50);
            $table->string('client_address', 100);
            $table->string('products', 100);
            $table->string('external_id', 30);
            $table->decimal('client_amount', 10, 2);
            $table->decimal('livreur_amount',  10, 2);
            $table->decimal('product_value', 10, 2);
            $table->decimal('return_fee', 10, 2);
            $table->boolean('has_exchange')->default(false);

            // Foreign keys
            $table->unsignedTinyInteger('id_wilaya');
            $table->unsignedInteger('id_commune');
            $table->string('id_exchange_return', 9)->nullable(); // for exchange or related colie
            $table->string('id_status', 3);
            $table->uuid('id_payment')->nullable(); // nullable : not paid yet
            $table->unsignedBigInteger('livreur_id')->nullable();

            $table->index('id_wilaya');
            $table->index('id_commune');
            $table->index('id_status');
            $table->index('id_payment');

            // Define foreign key constraints
            $table->foreign('id_wilaya')->references('id')->on('wilayas')->onDelete('restrict');
            $table->foreign('id_commune')->references('id')->on('communes')->onDelete('restrict');
            $table->foreign('id_exchange_return')->references('id')->on(table: 'colies')->onDelete('cascade');
            $table->foreign('id_status')->references('id')->on('statuses')->onDelete('restrict');
            $table->foreign('id_payment')->references('id')->on('payments')->onDelete('set null');
            $table->foreign('livreur_id')->references('id')->on('livreurs')->onDelete('set null');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('colies');
    }
};
