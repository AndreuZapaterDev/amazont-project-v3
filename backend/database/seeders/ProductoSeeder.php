<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use App\Models\producto;

class ProductoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ruta al JSON
        $json = File::get(database_path('data/products.json'));
        $productos = json_decode($json, true);

        foreach ($productos as $prod) {
            producto::create([
                'nombre' => $prod['nombre'],
                'precio' => (float) $prod['precio'],
                'descuento' => (float) $prod['descuento'],
                'descripcion' => $prod['descripcion'],
                'stock' => (int) $prod['stock'],
                'inicio' => (bool) $prod['inicio'],
            ]);
        }
    }
}
