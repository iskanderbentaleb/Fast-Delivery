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
        Schema::create('colie_histories', function (Blueprint $table) {
            $table->id();

            $table->string('id_colie' , 9);
            $table->string('id_status' , 3);
            $table->string('id_reason', 3)->nullable(); // optional reason
            $table->unsignedBigInteger('id_livreur')->nullable(); // optional livreur
            $table->string(column: 'note')->nullable();

            $table->timestamps();

            // Foreign keys
            $table->foreign('id_colie')->references('id')->on('colies')->onDelete('cascade');
            $table->foreign('id_status')->references('id')->on('statuses')->onDelete('cascade');
            $table->foreign('id_reason')->references('id')->on('reasons')->nullOnDelete();
            $table->foreign('id_livreur')->references('id')->on('livreurs')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('colie_histories');
    }
};
