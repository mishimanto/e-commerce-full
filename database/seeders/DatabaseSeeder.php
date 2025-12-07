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
        /**
         * ===========================
         * Permissions
         * ===========================
         */
        $permissionsList = [
            'view dashboard',
            'manage products',
            'manage categories',
            'manage orders',
            'manage users',
        ];

        foreach ($permissionsList as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        /**
         * ===========================
         * Roles
         * ===========================
         */
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $adminRole->syncPermissions(Permission::all());

        $userRole = Role::firstOrCreate(['name' => 'user']);

        /**
         * ===========================
         * Users (2 users)
         * ===========================
         */
        $admin = User::firstOrCreate(
            ['email' => 'admin@gmail.com'],
            [
                'name' => 'Admin User',
                'password' => '$2y$12$xFr5LNwIYpW3YUkQN/lEuOoxABgSk8nquV8Iqlmt0G5rXJu6WLFiW', // Already hashed
                'phone' => '01234567890',
                'address' => 'Admin Address',
            ]
        );
        $admin->assignRole('admin');

        $user = User::firstOrCreate(
            ['email' => 'user@gmail.com'],
            [
                'name' => 'Regular User',
                'password' => '$2y$12$aLCSbzUjbhVs0fH2Zm4hJuZ30QvEK6Pmwq55pGQdJ0maSHNTVi/h6', // Already hashed
                'phone' => '01234567891',
                'address' => 'User Address',
            ]
        );
        $user->assignRole('user');

        /**
         * ===========================
         * Categories (7 categories)
         * ===========================
         */
        $categories = [
            [
                'id' => 1,
                'name' => 'Electronics',
                'slug' => 'electronics',
                'description' => 'Description for Electronics',
                'image' => 'categories/ydKzb8seZz07EKdRBq7AsGWnEaNsS20YRT3nOmVi.png',
                'is_active' => 1
            ],
            [
                'id' => 2,
                'name' => 'Clothing',
                'slug' => 'clothing',
                'description' => 'Description for Clothing',
                'image' => null,
                'is_active' => 1
            ],
            [
                'id' => 3,
                'name' => 'Books',
                'slug' => 'books',
                'description' => 'Description for Books',
                'image' => null,
                'is_active' => 1
            ],
            [
                'id' => 4,
                'name' => 'Home & Kitchen',
                'slug' => 'home-kitchen',
                'description' => 'Description for Home & Kitchen',
                'image' => null,
                'is_active' => 1
            ],
            [
                'id' => 5,
                'name' => 'Sports',
                'slug' => 'sports',
                'description' => 'Description for Sports',
                'image' => null,
                'is_active' => 1
            ],
            [
                'id' => 7,
                'name' => 'Gym Item',
                'slug' => 'gym-item',
                'description' => 'Gym instruments',
                'image' => null,
                'is_active' => 1
            ],
        ];

        foreach ($categories as $cat) {
            Category::updateOrCreate(
                ['id' => $cat['id']],
                $cat
            );
        }

        /**
         * ===========================
         * Products (8 products)
         * ===========================
         */
        $products = [
            [
                'id' => 1,
                'category_id' => 1,
                'name' => 'Apple Smart Watch',
                'slug' => 'apple-smart-watch',
                'description' => 'Latest apple gen 3 smartwatch with advanced features',
                'price' => 300.00,
                'sale_price' => 320.00,
                'stock_quantity' => 50,
                'sku' => 'SMART-X-001',
                'images' => ["products/cS4AxbXTBae0nzKo4EEpIJSLrz7uz95LWAGk35ru.jpg"],
                'is_featured' => 1,
                'is_active' => 1
            ],
            [
                'id' => 2,
                'category_id' => 1,
                'name' => 'Dell XPS 13',
                'slug' => 'dell-xps-13',
                'description' => 'High-performance laptop for professionals',
                'price' => 1299.99,
                'sale_price' => 1199.99,
                'stock_quantity' => 30,
                'sku' => 'LAPTOP-PRO-001',
                'images' => ["products/pYJHzT9lxJmbbdvmQNAZhoh44FX1y9dW9S6JdbGg.jpg"],
                'is_active' => 1,
                'is_featured' => 1
            ],
            [
                'id' => 3,
                'category_id' => 1,
                'name' => 'Wireless Headphones',
                'slug' => 'wireless-headphones',
                'description' => 'Noise cancelling wireless headphones',
                'price' => 199.99,
                'sale_price' => null,
                'stock_quantity' => 100,
                'sku' => 'HEAD-WL-001',
                'images' => ["products/hlx6mBY6YcqtfUTjUGTcf8nq7jhTOX3R6oqSOl90.jpg"],
                'is_active' => 1,
                'is_featured' => 0
            ],
            [
                'id' => 4,
                'category_id' => 2,
                'name' => 'Sports T-Shirt',
                'slug' => 'sports-t-shirt',
                'description' => 'Breathable sports t-shirt',
                'price' => 29.99,
                'stock_quantity' => 199,
                'sale_price' => null,
                'sku' => 'TSHIRT-SP-001',
                'images' => ["products/kcj0iTekjLEBMjj4GIGc5vN81UbZuPZDay01fxZk.jpg"],
                'is_active' => 1,
                'is_featured' => 0
            ],
            [
                'id' => 5,
                'category_id' => 4,
                'name' => 'Cookware Set',
                'slug' => 'cookware-set',
                'description' => '10-piece cookware set for kitchen',
                'price' => 149.99,
                'sale_price' => 129.99,
                'stock_quantity' => 40,
                'sku' => 'COOK-SET-001',
                'images' => ["products/S12iV7bZhopXKTiRk1Bt5L9LehsNUQp31eVGDzYi.jpg"],
                'is_active' => 1,
                'is_featured' => 0
            ],
            [
                'id' => 6,
                'category_id' => 5,
                'name' => 'Demo Product',
                'slug' => 'demo-product',
                'description' => 'lorem ipsum',
                'price' => 120.00,
                'sale_price' => 1550.00,
                'stock_quantity' => 7,
                'sku' => 'JKDF-12FLK',
                'images' => [
                    "products/W0yiB1aFgo8IH8qchNSYj732QxXtsRpoLfwdtnjH.jpg",
                    "products/RG6newQ5CjdwWAJPutJGUXCfTlYISu8zoiaOOdm1.jpg",
                    "products/4cNiWpmE6QZfgxNe7vGDUc1aHnfxvQhF2GGT9zVE.jpg"
                ],
                'is_active' => 1,
                'is_featured' => 0
            ],
            [
                'id' => 7,
                'category_id' => 1,
                'name' => 'Apple Airpods 2 Pro',
                'slug' => 'apple-airpods-2-pro',
                'description' => '2nd gen apple airpods',
                'price' => 190.00,
                'sale_price' => 200.00,
                'stock_quantity' => 20,
                'sku' => 'APP-12KJ',
                'images' => ["products/3jV9UDVcEixhswZNnZn2TqlopyH0OLPKKVGYDpbO.jpg"],
                'is_active' => 1,
                'is_featured' => 0
            ],
            [
                'id' => 8,
                'category_id' => 5,
                'name' => 'Nike Shoe',
                'slug' => 'nike-shoe',
                'description' => 'Nike sports shoe',
                'price' => 100.00,
                'sale_price' => null,
                'stock_quantity' => 50,
                'sku' => 'NKL-122KL',
                'images' => ["products/5uqgGl3DEtEggKoD3pedaEeGWuR2JEjOezWVPMFp.jpg"],
                'is_active' => 1,
                'is_featured' => 0
            ],
        ];

        foreach ($products as $product) {
            Product::updateOrCreate(
                ['id' => $product['id']],
                $product
            );
        }
    }
}
