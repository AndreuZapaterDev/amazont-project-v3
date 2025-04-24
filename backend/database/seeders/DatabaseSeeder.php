<?php
namespace Database\Seeders;
use App\Models\User;
use App\Models\perfil_usuario;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Crear perfil de usuario administrador
        $perfil = new perfil_usuario();
        $perfil->nombre = 'Admin';
        $perfil->apellidos = 'System';
        $perfil->fecha_nacimiento = '2000-01-01';
        $perfil->direccion = 'Calle Principal 123';
        $perfil->telefono = '123456789';
        $perfil->genero = 1;
        $perfil->imagen_usuario = 'default.jpg';
        $perfil->save();

        // Crear usuario administrador
        $user = new User();
        $user->email = 'admin@admin.com';
        $user->password = Hash::make('admin');
        $user->rol = 1; // 1 = admin
        $user->perfil_usuario_id = $perfil->id;
        $user->save();


        $this->call(ProductoSeeder::class);

        $this->call(ImagenProductoSeeder::class);

    }
}
