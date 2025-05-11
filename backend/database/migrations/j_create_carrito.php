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
        Schema::create('carrito', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users');
            $table->float('total');
            $table->datetime('fecha_pago')->nullable();
            $table->boolean('acabado')->nullable()->default(false);
            $table->unsignedBigInteger('metodo_pago_id')->nullable()->default(null);
            $table->foreign('metodo_pago_id')->references('id')->on('metodos_pago');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('carrito');
    }
};
