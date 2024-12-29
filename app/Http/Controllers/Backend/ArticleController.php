<?php

namespace App\Http\Controllers\Backend;

use App\Http\Controllers\Controller;
use App\Http\Requests\ArticleRequest;
use App\Models\Article;
use App\Models\Category;
use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

use function Laravel\Prompts\error;

class ArticleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // Mengambil data pencarian dari query string 'search'.
        $search = $request->input('search');
        // Mengambil data user yang sedang login.
        $user = $request->user();

        // Mengambil data artikel dari database dengan relasi 'category'.
        $articles = Article::with('category')
            // Jika ada data pencarian, lakukan pencarian berdasarkan judul artikel atau kategori artikel.
            ->when($search, function ($query, $search) {
                return $query->where('title', 'like', "%{$search}%")
                    ->orWhereHas('category', function ($query) use ($search) {
                        $query->where('title', 'like', "%{$search}%");
                    });
            })
            // Jika user memiliki role 'Author', hanya tampilkan artikel yang dibuat oleh user tersebut.
            ->when($user->hasRole('Author'), function ($query) use ($user) {
                return $query->where('user_id', $user->id);
            })
            // Jika user memiliki role 'Admin', tampilkan semua artikel.
            ->when($user->hasRole('Admin'), function ($query) {
                return $query;
            })
            ->latest()
            ->paginate(4);
        return Inertia::render('Backend/Article/Index', [
            'articles' => $articles
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Backend/Article/Create', [
            'category' => Category::get()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ArticleRequest $request)
    {
        /**
         * Validasi data yang diterima berdasarkan aturan di ArticleRequest
         * Periksa apakah ada file gambar yang diunggah
         * Simpan data artikel ke database menggunakan model Article
         */
        $data = $request->validated();

        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imagePath = $image->storeAs('public/images', $image->hashName());
            $data['image'] = $imagePath;
        }
        Article::create($data);
        return to_route('article.index');
    }

    /**
     * Di method show ini akan menampilkan halaman detail artikel.
     * Data artikel yang akan ditampilkan diambil berdasarkan slug yang diterima.

     * Pada halaman detail artikel, juga menampilkan daftar komentar yang terkait dengan artikel tersebut.
     * Komentar diurutkan berdasarkan waktu pembuatan terbaru.
     *
     */
    public function show($slug)
    {
        $article = Article::where('slug', $slug)->with(['category', 'user'])->firstOrFail();
        $comments = Comment::where('article_id', $article->id)
            ->with(['article', 'user'])
            ->latest()
            ->get();
        return Inertia::render('Backend/Article/Show', [
            'article' => $article,
            'comments' => $comments
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Article $article)
    {
        // Mengembalikan halaman dengan komponen Inertia "Backend/Article/Edit".
        // Data artikel yang akan diedit dikirimkan ke frontend.
        return Inertia::render('Backend/Article/Edit', [
            // Artikel yang dipilih, dimuat melalui model binding Laravel.
            'article' => $article,
            // Mengambil semua kategori dari database untuk ditampilkan di form edit.
            'categories' => Category::get()
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ArticleRequest $request, Article $article)
    {
        // Validasi data dari request berdasarkan aturan di ArticleRequest.
        $data = $request->validated();

        // Memeriksa apakah ada file gambar baru yang diunggah.
        if ($request->hasFile('image')) {
            // Jika artikel sudah memiliki gambar sebelumnya, hapus gambar tersebut dari penyimpanan.
            if ($article->image) {
                Storage::delete('public/images/' . basename($article->image));
            }
            // Menyimpan file gambar baru ke folder 'public/images'.
            $image = $request->file('image');
            $imagePath = $image->storeAs('public/images', $image->hashName());

            // Menambahkan path gambar baru ke array data untuk disimpan ke database.
            $data['image'] = $imagePath;
        } else {
            // Jika tidak ada file gambar baru, pastikan atribut 'image' dihapus dari data yang akan diupdate.
            unset($data['image']);
        }

        // Memperbarui data artikel di database dengan data yang sudah disiapkan.
        $article->update($data);
        return to_route('article.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Article $article)
    {
        if ($article->image) {
            Storage::delete('public/images/' . basename($article->image));
        }
        $article->delete();
        return to_route('article.index');
    }

    public function uploadImageContent(Request $request)
    {
        $request->validate([
            'upload' => 'image|mimes:png,jpg,jpeg'
        ]);

        if ($request->hasFile('upload')) {
            try {
                $file = $request->file('upload');
                $path = $file->store('images/imgContent', 'public');
                $url  = Storage::url($path);

                return response()->json([
                    'uploaded' => true,
                    'url' => $url
                ]);
            } catch (\Exception $e) {
                return response()->json([
                    'uploaded' => false,
                    'error' => [
                        'message' => 'failed to upload image' . $e->getMessage()
                    ]
                ], 500);
            }
        }
    }
}
