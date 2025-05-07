<?php

namespace Database\Factories;

use App\Models\producto;
use App\Models\User;
use App\Models\valoraciones;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\valoraciones>
 */
class ValoracionesFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = valoraciones::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Use the user IDs that we created in DatabaseSeeder
        $userIds = [1, 2, 3, 4];

        // Spanish phrases that could be used in reviews
        $spanishReviews = [
            "Muy buen producto, lo recomiendo.",
            "Excelente calidad precio, volvería a comprar.",
            "No cumplió con mis expectativas.",
            "Llegó antes de lo esperado, muy satisfecho.",
            "La calidad es regular, esperaba algo mejor.",
            "Increíble producto, supera todas mis expectativas.",
            "Regular, tiene algunos defectos menores.",
            "Mala experiencia, no lo recomendaría.",
            "Perfecto para lo que necesitaba.",
            "Buena relación calidad-precio.",
            "El envío fue rápido pero el producto decepcionante.",
            "Me encanta, justo lo que estaba buscando.",
            "Funciona muy bien, sin problemas hasta ahora.",
            "No es tan bueno como esperaba pero cumple su función.",
            "Muy contento con esta compra."
        ];

        return [
            'review' => fake()->randomElement($spanishReviews),
            'puntuacion' => fake()->numberBetween(1, 5),
            'fecha' => fake()->dateTimeBetween('-1 year', 'now'),
            'util' => fake()->numberBetween(0, 50),
            'usuario_id' => 1, // This will be overridden in the seeder
            'producto_id' => 1, // This will be overridden in the seeder
        ];
    }
}
