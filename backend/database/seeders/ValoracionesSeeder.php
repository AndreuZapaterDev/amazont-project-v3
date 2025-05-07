<?php

namespace Database\Seeders;

use App\Models\valoraciones;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Faker\Factory as FakerFactory;

class ValoracionesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Set Faker locale to Spanish
        $faker = FakerFactory::create('es_ES');

        // Generate between 0 and 4 valoraciones for each product (IDs 1-100)
        for ($productoId = 1; $productoId <= 100; $productoId++) {
            // Randomly decide how many valoraciones this product will have (0-4)
            $numValoraciones = random_int(0, 4);

            // Keep track of which users have already reviewed this product
            $usedUserIds = [];

            for ($i = 0; $i < $numValoraciones; $i++) {
                // Select a random user ID that hasn't reviewed this product yet
                $availableUserIds = array_diff([1, 2, 3, 4], $usedUserIds);

                // If all users have reviewed this product, break
                if (empty($availableUserIds)) {
                    break;
                }

                $userId = $availableUserIds[array_rand($availableUserIds)];
                $usedUserIds[] = $userId;

                // Create the valoracion
                valoraciones::factory()->create([
                    'producto_id' => $productoId,
                    'usuario_id' => $userId,
                ]);
            }
        }
    }
}
