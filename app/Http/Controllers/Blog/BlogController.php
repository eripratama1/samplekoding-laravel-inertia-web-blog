<?php

namespace App\Http\Controllers\Blog;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\Category;
use App\Models\Comment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BlogController extends Controller
{
    public function home()
    {
        $articles = Article::with(['category', 'user'])->latest()->paginate(3);
        return Inertia::render('Blog/Home', [
            'articles' => $articles,
            'roles' => auth()->check() ? auth()->user()->getRoleNames() : []
        ]);
    }

    public function categories()
    {
        $categories = Category::get();
        return Inertia::render('Blog/Categories', [
            'categories' => $categories,
            'roles' => auth()->check() ? auth()->user()->getRoleNames() : []
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
        $articles = $category->articles()->with(['category', 'user'])->latest()->paginate(4);
        return Inertia::render('Blog/ArticleByCategory', [
            'articles' => $articles,
            'category' => $category,
            'roles' => auth()->check() ? auth()->user()->getRoleNames() : []
        ]);
    }

    public function detailArticle($slug)
    {
        // Mendapatkan artikel berdasarkan slug dengan relasi kategori dan pengguna.
        $article = Article::where('slug', $slug)->with(['category', 'user'])->firstOrFail();

        // Mendapatkan artikel lain yang memiliki kategori yang sama,
        // tetapi tidak termasuk artikel yang sedang ditampilkan (id-nya berbeda).
        $relatedArticles = Article::where('category_id', $article->category_id)
            ->where('id', '!=', $article->id)
            ->get();

        /** Kode berikut digunakan untuk mendapatkan komentar yang terkait dengan
         *  artikel yang sedang ditampilkan.
         *  Kode ini akan mengambil semua komentar yang memiliki article_id yang sama dengan
         *  id artikel yang sedang ditampilkan.
        */
        $comments = Comment::where('article_id',$article->id)->with(['article','user'])
        ->latest()
        ->get();
        // mengirimkan data artikel dan artikel terkait ke komponen "Blog/DetailArticle".
        return Inertia::render('Blog/DetailArticle', [
            'article' => $article,
            'relatedArticles' => $relatedArticles,
            'comments' => $comments,
            'roles' => auth()->check() ? auth()->user()->getRoleNames() : []
        ]);
    }

    public function searchArticle(Request $request)
    {
         // Mengambil input query dari request
        $query = $request->input('query');

         /**
          * Melakukan pencarian artikel jika query tidak kosong
          * Menggunakan metode when() untuk memeriksa apakah query tidak kosong
          * Jika tidak kosong maka akan mencari artikel berdasarkan judul dan kategori
          * Menggunakan whereHas() untuk mencari artikel berdasarkan judul kategori
          */

        $articles = Article::when($query, function ($queryBuilder) use ($query) {
            return $queryBuilder->where('title', 'like', "%{$query}%")
                ->orWhereHas('category', function ($categoryQuery) use ($query) {
                    $categoryQuery->where('title', 'like', "%{$query}%");
                });
        })->get();

        return response()->json($articles);
    }
}
