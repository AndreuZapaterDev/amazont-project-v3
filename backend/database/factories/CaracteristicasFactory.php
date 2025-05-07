<?php

namespace Database\Factories;

use App\Models\producto;
use App\Models\caracteristicas;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\caracteristicas>
 */
class CaracteristicasFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = caracteristicas::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Spanish characteristics that describe products
        $spanishCharacteristics = [
            "Resistente al agua",
            "Material de alta calidad",
            "Disponible en varios colores",
            "Diseño ergonómico",
            "Ligero y portátil",
            "Batería de larga duración",
            "Conexión Bluetooth integrada",
            "Compatible con múltiples dispositivos",
            "Pantalla táctil de alta resolución",
            "Incluye garantía de dos años",
            "Fabricado con materiales reciclados",
            "Ahorro energético",
            "Fácil de limpiar",
            "Resistente a golpes y caídas",
            "Control remoto incluido",
            "Plegable para fácil almacenamiento",
            "Ajustable a diferentes tamaños",
            "Tecnología de última generación",
            "Sistema de refrigeración avanzado",
            "Múltiples funciones programables"
        ];

        return [
            'texto' => fake()->randomElement($spanishCharacteristics),
            'producto_id' => 1, // This will be overridden in the seeder
        ];
    }
}
