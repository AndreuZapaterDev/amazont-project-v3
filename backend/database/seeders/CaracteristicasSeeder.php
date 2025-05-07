<?php

namespace Database\Seeders;

use App\Models\caracteristicas;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Faker\Factory as FakerFactory;

class CaracteristicasSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Set Faker locale to Spanish
        $faker = FakerFactory::create('es_ES');

        // Generate between 1 and 5 características for each product (IDs 1-100)
        for ($productoId = 1; $productoId <= 100; $productoId++) {
            // Randomly decide how many características this product will have (1-5)
            $numCaracteristicas = random_int(3, 5);

            // Keep track of used characteristics to avoid duplicates for the same product
            $usedCharacteristics = [];

            for ($i = 0; $i < $numCaracteristicas; $i++) {
                // Create the característica
                $caracteristica = caracteristicas::factory()->create([
                    'producto_id' => $productoId,
                ]);

                // Prevent duplicates by regenerating if this texto is already used for this product
                while (in_array($caracteristica->texto, $usedCharacteristics)) {
                    $caracteristica->delete();
                    $caracteristica = caracteristicas::factory()->create([
                        'producto_id' => $productoId,
                    ]);
                }

                $usedCharacteristics[] = $caracteristica->texto;
            }
        }
    }
}
