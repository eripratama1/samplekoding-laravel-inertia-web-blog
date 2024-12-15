<?php

namespace App\Http\Controllers\Blog;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BlogController extends Controller
{
    public function home()
    {
        $articles = Article::with(['category', 'user'])->latest()->paginate(4);
        return Inertia::render('Blog/Home', [
            'articles' => $articles
        ]);
    }

    public function categories()
    {
        $categories = Category::get();
        return Inertia::render('Blog/Categories', [
            'categories' => $categories
        ]);
    }

    public function articlesByCategory($categoryName)
    {
        /**
         * Mencari data kategori berdasarkan slug yang dikirim melalui parameter
         */

        $category = Category::where('slug', $categoryName)->first();

        /**
         * Mengambil artikel yang berhubungan dengan kategori tersebut
         * Memuat relasi 'category' dan 'user' untuk mengurangi query tambahan (eager loading)
         *          */
        $articles = $category->articles()->with(['category','user'])->latest()->paginate(4);
        return Inertia::render('Blog/ArticleByCategory',[
            'articles' => $articles,
            'category' => $category
        ]);
    }
}
