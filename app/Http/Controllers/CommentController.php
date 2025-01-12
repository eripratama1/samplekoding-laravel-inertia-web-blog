<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\Comment;
use App\Models\User;
use App\Notifications\CommentNotification;
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
            'authorName' => 'string',
            'parent_id' => 'nullable|exists:comments,id'
        ]);

        // Simpan data ke dalam database
        $comment = new Comment();
        $comment->content = $validated['content'];
        $comment->article_id = $validated['article_id'];
        $comment->parent_id = $validated['parent_id'] ?? null;

        $comment->user_id = Auth::id();
        $comment->save();

        // Ambil data artikel beserta user-nya
        $article = Article::with('user')->find($validated['article_id']);

        // Cek apakah komentar ini merupakan balasan atau komentar baru
        if ($comment->parent_id) {
            // Tangani notifikasi untuk balasan komentar
            $this->handleReplyCommentNotif($comment, $article);
        } else {
            // Tangani notifikasi untuk komentar baru
            $this->handleNewCommentNotif($article, $validated['authorId']);
        }


        return redirect()->back();
    }

    /**
     * Method untuk mengirim notifikasi ke user.
     *
     * @param User $user - User penerima notifikasi
     * @param string $message - Pesan notifikasi
     * @param Article $article - Artikel terkait
     * @param User $sender - User pengirim notifikasi
     */
    private function sendNotifications(User $user, string $message, Article $article, User $sender)
    {
        // Mengirim notifikasi menggunakan CommentNotification
        $user->notify(new CommentNotification($message, $article, $sender));
    }

    /**
     * Tangani notifikasi untuk balasan komentar.
     *
     * @param Comment $comment - Komentar yang dibuat
     * @param Article $article - Artikel terkait komentar
     */
    private function handleReplyCommentNotif(Comment $comment, Article $article)
    {
        // Ambil komentar parent beserta data user-nya
        $parentComment = Comment::with('user')->find($comment->parent_id);

        // Jika parent comment valid dan memiliki pemilik
        if ($parentComment && $parentComment->user) {
            // Pemilik komentar yang dibalas
            $commentOwner = $parentComment->user;

            // Buat pesan notifikasi sesuai konteks
            $message = Auth::id() === $article->user_id
                ? "Author membalas komentar anda pada artikel: " . $article->title
                : Auth::user()->name . " membalas komentar anda pada artikel: " . $article->title;

            // Kirim notifikasi ke pemilik komentar
            $this->sendNotifications($commentOwner, $message, $article, Auth::user());
        }
    }

    /**
     * Tangani notifikasi untuk komentar baru pada artikel.
     *
     * @param Article $article - Artikel yang dikomentari
     * @param int $authorId - ID penulis artikel
     */
    private function handleNewCommentNotif(Article $article, $authorId)
    {
        // Ambil data user penulis artikel
        $articleAuthor = User::find($authorId);

        // Jika user penulis artikel valid
        if ($articleAuthor) {
            // Buat pesan notifikasi
            $message = Auth::user()->name . " mengomentari artikel anda: " . $article->title;

            // Kirim notifikasi ke penulis artikel
            $this->sendNotifications($articleAuthor, $message, $article, Auth::user());
        }
    }
}
