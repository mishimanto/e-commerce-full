<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        Product::factory()->create([
            'name' => 'Sample Product',
            'slug' => 'sample-product',
            'price' => 99.99,
            'description' => 'This is a sample product description.',
            'stock_quantity' => 100,
            'sku' => 'PROD001',
            'is_featured' => true,
            'is_active' => true,
        ]);
    }
}