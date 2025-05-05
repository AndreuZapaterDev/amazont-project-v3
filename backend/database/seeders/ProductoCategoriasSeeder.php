<?php

namespace Database\Seeders;

use App\Models\productoCategorias;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class ProductoCategoriasSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        // Ruta al JSON
        $json = File::get(database_path('data/productoCategorias.json'));
        $productos = json_decode($json, true);

        foreach ($productos as $prod) {
            productoCategorias::create([
                'categoria_id' => (int) $prod['categoria_id'],
                'producto_id' => (int) $prod['producto_id'],
            ]);
        }
    }
}
