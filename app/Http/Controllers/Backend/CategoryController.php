<?php

namespace App\Http\Controllers\Backend;

use App\Http\Controllers\Controller;
use App\Http\Requests\CategoryRequest;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        /**
         * Menambahkan fungsi pencarian pada method index
         * dan method paginate
         */
        $search = $request->input('search');

        /**
         * / Mengambil semua notifikasi yang belum dibaca untuk pengguna yang sedang login.
         */
        $notifications = auth()->user()->unreadNOtifications;

        $categories = Category::query()
        ->when($search,function($query,$search){
            return $query->where('title','like',"%{$search}%");
        })->latest()->paginate(3);

        return Inertia::render('Backend/Category/Index',[
            'categories' => $categories,
            'notifications' => $notifications
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $notifications = auth()->user()->unreadNOtifications;
        return Inertia::render('Backend/Category/Create',[
            'notifications' => $notifications
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CategoryRequest $request)
    {
        $data = $request->validated();
        Category::create($data);
        return to_route('category.index');
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
    public function edit($id)
    {
        $notifications = auth()->user()->unreadNOtifications;
        return Inertia::render('Backend/Category/Edit',[
            'category' => Category::findOrFail($id),
            'notifications' => $notifications
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(CategoryRequest $request, Category $category)
    {
        $data = $request->validated();
        $category->update($data);
        return to_route('category.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category)
    {
        $category->delete();
        return to_route('category.index');
    }
}
