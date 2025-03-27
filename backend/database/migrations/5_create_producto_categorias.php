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
        Schema::create('producto_categorias', function (Blueprint $table) {
            $table->id();
            $table->foreignId('categoria_id')->constrained('categoria');
            $table->foreignId('producto_id')->constrained('producto');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('producto_categorias');
    }
};
