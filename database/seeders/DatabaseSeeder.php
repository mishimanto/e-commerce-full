<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create permissions
        $permissions = [
            'view dashboard',
            'manage products',
            'manage categories',
            'manage orders',
            'manage users',
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }

        // Create roles
        $adminRole = Role::create(['name' => 'admin']);
        $adminRole->givePermissionTo(Permission::all());

        $userRole = Role::create(['name' => 'user']);

        // Create admin user
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@gmail.com',
            'password' => Hash::make('shimanto'),
            'phone' => '01234567890',
            'address' => 'Admin Address',
        ]);
        $admin->assignRole('admin');

        // Create regular user
        $user = User::create([
            'name' => 'Regular User',
            'email' => 'user@gmail.com',
            'password' => Hash::make('shimanto'),
            'phone' => '01234567891',
            'address' => 'User Address',
        ]);
        $user->assignRole('user');

        // Create categories
        $categories = [
            ['name' => 'Electronics', 'slug' => 'electronics'],
            ['name' => 'Clothing', 'slug' => 'clothing'],
            ['name' => 'Books', 'slug' => 'books'],
            ['name' => 'Home & Kitchen', 'slug' => 'home-kitchen'],
            ['name' => 'Sports', 'slug' => 'sports'],
        ];

        foreach ($categories as $category) {
            Category::create([
                'name' => $category['name'],
                'slug' => $category['slug'],
                'description' => 'Description for ' . $category['name'],
                'is_active' => true,
            ]);
        }

        // Get all categories
        $categoryIds = Category::pluck('id')->toArray();

        // Create sample products
        $products = [
            [
                'name' => 'Smartphone X',
                'slug' => 'smartphone-x',
                'description' => 'Latest smartphone with advanced features',
                'price' => 699.99,
                'stock_quantity' => 50,
                'sku' => 'SMART-X-001',
                'is_featured' => true,
            ],
            [
                'name' => 'Laptop Pro',
                'slug' => 'laptop-pro',
                'description' => 'High-performance laptop for professionals',
                'price' => 1299.99,
                'sale_price' => 1199.99,
                'stock_quantity' => 30,
                'sku' => 'LAPTOP-PRO-001',
                'is_featured' => true,
            ],
            [
                'name' => 'Wireless Headphones',
                'slug' => 'wireless-headphones',
                'description' => 'Noise cancelling wireless headphones',
                'price' => 199.99,
                'stock_quantity' => 100,
                'sku' => 'HEAD-WL-001',
            ],
            [
                'name' => 'Sports T-Shirt',
                'slug' => 'sports-t-shirt',
                'description' => 'Breathable sports t-shirt',
                'price' => 29.99,
                'stock_quantity' => 200,
                'sku' => 'TSHIRT-SP-001',
            ],
            [
                'name' => 'Cookware Set',
                'slug' => 'cookware-set',
                'description' => '10-piece cookware set for kitchen',
                'price' => 149.99,
                'sale_price' => 129.99,
                'stock_quantity' => 40,
                'sku' => 'COOK-SET-001',
            ],
        ];

        foreach ($products as $index => $product) {
            Product::create([
                'category_id' => $categoryIds[$index % count($categoryIds)],
                'name' => $product['name'],
                'slug' => $product['slug'],
                'description' => $product['description'],
                'price' => $product['price'],
                'sale_price' => $product['sale_price'] ?? null,
                'stock_quantity' => $product['stock_quantity'],
                'sku' => $product['sku'],
                'images' => json_encode([
                    'products/sample' . ($index + 1) . '_1.jpg',
                    'products/sample' . ($index + 1) . '_2.jpg'
                ]),
                'is_featured' => $product['is_featured'] ?? false,
                'is_active' => true,
            ]);
        }
    }
}