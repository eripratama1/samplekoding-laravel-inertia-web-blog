<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CommentController extends Controller
{
    /**
     * Method ini digunakan untuk menyimpan data komentar baru.
     */
    public function store(Request $request)
    {
        // Jika user belum login, maka redirect ke halaman login
        if (!Auth::user()) {
            return to_route('login');
        }

        // Validasi data yang dikirim
        $validated = $request->validate([
            'content' => 'required|max:1000|string',
            'article_id' => 'exists:articles,id',
            'authorId' => 'exists:users,id',
            'authorName' => 'string'
        ]);

        // Simpan data ke dalam database
        $comment = new Comment();
        $comment->content = $validated['content'];
        $comment->article_id = $validated['article_id'];
        $comment->parent_id = $validated['parent_id'] ?? null;

        $comment->user_id = Auth::id();
        $comment->save();

        return redirect()->back();
    }
}
