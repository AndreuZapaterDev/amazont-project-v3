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
        $this->call(ProductoSeeder::class);

        $this->call(ImagenProductoSeeder::class);

        $this->call(CategoriaSeeder::class);

        $this->call(ProductoCategoriasSeeder::class);

        $this->call(PerfilUsuarioSeeder::class);

        $this->call(UsersSeeder::class);

        $this->call(ValoracionesSeeder::class);

        $this->call(CaracteristicasSeeder::class);
    }
}
