<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CommentController extends Controller
{
    public function store(Request $request)
    {
        if (!Auth::user()) {
            return to_route('login');
        }

        $validated = $request->validate([
            'content' => 'required|max:1000|string',
            'article_id' => 'exists:articles,id',
            'authorId' => 'exists:users,id',
            'authorName' => 'string'
        ]);

        $comment = new Comment();
        $comment->content = $validated['content'];
        $comment->article_id = $validated['article_id'];
        $comment->parent_id = $validated['parent_id'] ?? null;

        $comment->user_id = Auth::id();
        $comment->save();

        return redirect()->back();
    }
}
