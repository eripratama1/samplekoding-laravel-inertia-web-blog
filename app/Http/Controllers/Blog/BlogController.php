<?php

namespace App\Http\Controllers\Blog;

use App\Http\Controllers\Controller;
use App\Models\Article;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BlogController extends Controller
{
    public function home()
    {
        $articles = Article::with(['category','user'])->latest()->paginate(4);
        return Inertia::render('Blog/Home',[
            'articles' => $articles
        ]);
    }
}
