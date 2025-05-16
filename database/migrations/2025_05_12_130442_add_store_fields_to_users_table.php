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
        Schema::table('users', function (Blueprint $table) {
            $table->string('storename', 50)->after('name');
            $table->string('phone', 50)->after('storename');
            $table->string('address', 100)->after('phone');

            $table->unsignedTinyInteger('id_wilaya')->nullable()->after('address');
            $table->unsignedInteger('id_commune')->nullable()->after('id_wilaya');

            $table->foreign('id_wilaya')->references('id')->on('wilayas')->nullOnDelete();
            $table->foreign('id_commune')->references('id')->on('communes')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', callback: function (Blueprint $table) {
            $table->dropForeign(['id_wilaya']);
            $table->dropForeign(['id_commune']);

            $table->dropColumn(['storename', 'phone', 'address', 'id_wilaya', 'id_commune']);
        });
    }
};
