<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CheckoutController extends Controller
{
    public function index()
    {
        $cart = session()->get('cart', []);
        
        if (empty($cart)) {
            return redirect()->route('cart.index')->with('error', 'Your cart is empty.');
        }

        $cartItems = [];
        $subtotal = 0;

        foreach ($cart as $productId => $item) {
            $product = Product::find($productId);
            if ($product && $product->stock_quantity >= $item['quantity']) {
                $item['product'] = $product;
                $item['subtotal'] = $product->final_price * $item['quantity'];
                $cartItems[] = $item;
                $subtotal += $item['subtotal'];
            }
        }

        $tax = $subtotal * 0.1; // 10% tax
        $shipping = 50; // Fixed shipping
        $total = $subtotal + $tax + $shipping;

        return Inertia::render('Checkout/Index', [
            'cartItems' => $cartItems,
            'subtotal' => $subtotal,
            'tax' => $tax,
            'shipping' => $shipping,
            'total' => $total,
            'user' => Auth::user()
        ]);
    }

    public function process(Request $request)
    {
        $request->validate([
            'shipping_address' => 'required|string',
            'payment_method' => 'required|in:cash,card,bkash,nagad'
        ]);

        $cart = session()->get('cart', []);
        
        if (empty($cart)) {
            return redirect()->route('cart.index')->with('error', 'Your cart is empty.');
        }

        // Calculate order totals
        $subtotal = 0;
        $orderItems = [];

        foreach ($cart as $productId => $item) {
            $product = Product::find($productId);
            if ($product && $product->stock_quantity >= $item['quantity']) {
                $product->decrement('stock_quantity', $item['quantity']);
                
                $orderItems[] = [
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'unit_price' => $product->final_price,
                    'total' => $product->final_price * $item['quantity']
                ];
                
                $subtotal += $product->final_price * $item['quantity'];
            }
        }

        $tax = $subtotal * 0.1;
        $shipping = 50;
        $total = $subtotal + $tax + $shipping;

        // Create order
        $order = Order::create([
            'user_id' => Auth::id(),
            'subtotal' => $subtotal,
            'tax' => $tax,
            'shipping' => $shipping,
            'total' => $total,
            'status' => 'pending',
            'payment_status' => 'pending',
            'payment_method' => $request->payment_method,
            'shipping_address' => $request->shipping_address,
            'billing_address' => $request->billing_address ?? $request->shipping_address,
            'notes' => $request->notes
        ]);

        // Add order items
        $order->items()->createMany($orderItems);

        // Clear cart
        session()->forget('cart');

        return redirect()->route('orders.show', $order->id)->with('success', 'Order placed successfully!');
    }
}