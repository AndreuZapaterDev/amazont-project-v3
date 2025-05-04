<?php

namespace Database\Seeders;

use App\Models\categoria;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;


class CategoriaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        // Ruta al JSON
        $json = File::get(database_path('data/categories.json'));
        $categorias = json_decode($json, true);

        foreach ($categorias as $cat) {
            categoria::create([
                'nombre' => $cat['nombre'],
                'inicio' => $cat['inicio'],
                'icono' => $cat['icono'],
            ]);
        }
    }
}
