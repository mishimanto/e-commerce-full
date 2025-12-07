<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'total_users' => User::count(),
            'total_products' => Product::count(),
            'total_categories' => \App\Models\Category::count(),
            'total_orders' => Order::count(),
            'revenue' => Order::where('payment_status', 'paid')->sum('total'),
            'recent_orders' => Order::with('user')->latest()->take(5)->get(),
            'top_products' => Product::with('category')->orderBy('created_at', 'desc')->take(3)->get()
        ];

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats
        ]);
    }
}