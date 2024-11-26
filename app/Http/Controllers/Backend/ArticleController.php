<?php

namespace App\Http\Controllers\Backend;

use App\Http\Controllers\Controller;
use App\Http\Requests\ArticleRequest;
use App\Models\Article;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ArticleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Backend/Article/Index', [
            /**
             * kode ini diguankan untuk eager load relasi category dan user agar
             * query lebih efisien.
             */
            'articles' => Article::with(['category', 'user'])->get()
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
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
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
}
