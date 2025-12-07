<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        
        // Get user's orders
        $orders = Order::where('user_id', $user->id)
            ->with(['items.product'])
            ->latest()
            ->paginate(10);
        
        // Get recent orders for dashboard
        $recentOrders = Order::where('user_id', $user->id)
            ->with(['items'])
            ->latest()
            ->take(5)
            ->get();
        
        // Calculate stats
        $totalOrders = Order::where('user_id', $user->id)->count();
        $completedOrders = Order::where('user_id', $user->id)
            ->where('status', 'delivered')
            ->count();
        $pendingOrders = Order::where('user_id', $user->id)
            ->whereIn('status', ['pending', 'processing', 'shipped'])
            ->count();
        $totalSpent = Order::where('user_id', $user->id)
            ->where('payment_status', 'paid')
            ->sum('total');
        
        $stats = [
            'total_orders' => $totalOrders,
            'completed_orders' => $completedOrders,
            'pending_orders' => $pendingOrders,
            'total_spent' => $totalSpent,
        ];
        
        // If user is admin, redirect to admin dashboard
        if ($user->hasRole('admin')) {
            return redirect()->route('admin.dashboard');
        }
        
        return Inertia::render('Dashboard', [
            'orders' => $orders,
            'recentOrders' => $recentOrders,
            'stats' => $stats,
        ]);
    }
}