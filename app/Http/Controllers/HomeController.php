<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index(Request $request)
    {
        $featuredProducts = Product::where('is_featured', true)
            ->where('is_active', true)
            ->with('category')
            ->take(8)
            ->get();

        $categories = Category::where('is_active', true)
            ->withCount('products')
            ->get();

        
        // Get all active products with filters
        $query = Product::where('is_active', true)->with('category');

        // Multiple categories filter
        if ($request->has('categories') && !empty($request->categories)) {
            $query->whereIn('category_id', (array) $request->categories);
        }

        // Price range filter
        if ($request->has('min_price') && $request->min_price > 0) {
            $query->where('price', '>=', $request->min_price);
        }
        
        if ($request->has('max_price') && $request->max_price > 0) {
            $query->where('price', '<=', $request->max_price);
        }

        // Sorting
        if ($request->has('sort')) {
            switch ($request->sort) {
                case 'price_asc':
                    $query->orderBy('price', 'asc');
                    break;
                case 'price_desc':
                    $query->orderBy('price', 'desc');
                    break;
                case 'name_asc':
                    $query->orderBy('name', 'asc');
                    break;
                case 'name_desc':
                    $query->orderBy('name', 'desc');
                    break;
                default:
                    $query->latest();
                    break;
            }
        } else {
            $query->latest();
        }

        $products = $query->paginate(12);

        return Inertia::render('Welcome', [
            'featuredProducts' => $featuredProducts,
            'categories' => $categories,
            'products' => $products
        ]);
    }

    public function filterProducts(Request $request)
    {
        $query = Product::where('is_active', true)->with('category');

        // Multiple categories filter
        if ($request->has('categories') && !empty($request->categories)) {
            $query->whereIn('category_id', (array) $request->categories);
        }

        // Price range filter
        if ($request->has('min_price') && $request->min_price > 0) {
            $query->where('price', '>=', $request->min_price);
        }
        
        if ($request->has('max_price') && $request->max_price > 0) {
            $query->where('price', '<=', $request->max_price);
        }

        // Sorting
        if ($request->has('sort')) {
            switch ($request->sort) {
                case 'price_asc':
                    $query->orderBy('price', 'asc');
                    break;
                case 'price_desc':
                    $query->orderBy('price', 'desc');
                    break;
                case 'name_asc':
                    $query->orderBy('name', 'asc');
                    break;
                case 'name_desc':
                    $query->orderBy('name', 'desc');
                    break;
                default:
                    $query->latest();
                    break;
            }
        } else {
            $query->latest();
        }

        $products = $query->paginate(12);
        $categories = Category::where('is_active', true)
            ->withCount('products')
            ->get();


        return response()->json([
            'products' => $products,
            'categories' => $categories
        ]);
    }
}