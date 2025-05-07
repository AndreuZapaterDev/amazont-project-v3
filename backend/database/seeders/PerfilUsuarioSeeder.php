<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use App\Models\perfil_usuario;

class PerfilUsuarioSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ruta al JSON
        $json = File::get(database_path('data/perfilUsuario.json'));
        $categorias = json_decode($json, true);

        foreach ($categorias as $cat) {
            perfil_usuario::create([
                'nombre' => $cat['nombre'],
                'apellidos' => $cat['apellidos'],
                'fecha_nacimiento' => $cat['fecha_nacimiento'],
                'direccion' => $cat['direccion'],
                'telefono' => $cat['telefono'],
                'genero' => $cat['genero'],
                'imagen_usuario' => $cat['imagen_usuario'],
            ]);
        }
    }
}
