<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class ProductFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => $this->faker->words(3, true),
            'slug' => $this->faker->slug(),
            'description' => $this->faker->paragraphs(3, true),
            'price' => $this->faker->randomFloat(2, 10, 1000),
            'sale_price' => $this->faker->optional()->randomFloat(2, 5, 800),
            'stock_quantity' => $this->faker->numberBetween(0, 100),
            'sku' => 'SKU-' . $this->faker->unique()->numberBetween(1000, 9999),
            'images' => json_encode([
                $this->faker->imageUrl(400, 400, 'products'),
                $this->faker->imageUrl(400, 400, 'products')
            ]),
            'is_featured' => $this->faker->boolean(30),
            'is_active' => true,
        ];
    }
}