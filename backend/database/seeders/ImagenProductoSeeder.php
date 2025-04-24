<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\imagenes;
use Illuminate\Support\Facades\File;

class ImagenProductoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $json = File::get(database_path('data/product_images.json'));
        $imagenes = json_decode($json, true);

        foreach ($imagenes as $img) {
            imagenes::create([
                'url' => $img['url'],
                'producto_id' => (int)$img['producto_id'],
            ]);
        }
    }
}
