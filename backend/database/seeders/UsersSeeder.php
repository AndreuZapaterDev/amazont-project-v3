<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use App\Models\User;

class UsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ruta al JSON
        $json = File::get(database_path('data/users.json'));
        $categorias = json_decode($json, true);

        foreach ($categorias as $cat) {
            User::create([
                'email' => $cat['email'],
                'password' => bcrypt($cat['password']),
                'rol' => $cat['rol'],
                'perfil_usuario_id' => $cat['perfil_usuario_id'],
            ]);
        }
    }
}
