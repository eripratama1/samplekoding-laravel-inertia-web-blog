<?php

use App\Http\Controllers\Backend\ArticleController;
use App\Http\Controllers\Backend\CategoryController;
use App\Http\Controllers\Backend\RoleController;
use App\Http\Controllers\Blog\BlogController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Route::get('/', function () {
//     return Inertia::render('Welcome', [
//         'canLogin' => Route::has('login'),
//         'canRegister' => Route::has('register'),
//         'laravelVersion' => Application::VERSION,
//         'phpVersion' => PHP_VERSION,
//     ]);
// });

Route::get('/', [BlogController::class, 'home'])->name('home');
Route::get('/categories', [BlogController::class, 'categories'])->name('categories');
Route::get('/articles-category/{categoryName}', [BlogController::class, 'articlesByCategory'])
    ->name('articlesByCategory');

Route::get('/read-article/{slug}', [BlogController::class, 'detailArticle'])->name('read');
Route::get('/search-articles', [BlogController::class, 'searchArticle']);
Route::post('/comments', [CommentController::class, 'store']);


Route::middleware('auth')->group(function () {
    Route::post('/become-author', [ProfileController::class, 'becomeAuthor'])
        ->name('become-author');

    Route::get('/dashboard', function () {
        // Mendapatkan data user yang sedang login menggunakan helper auth()
        $user = auth()->user();
        return Inertia::render('Dashboard', [
            'auth' => [
                // Mengirimkan data user yang sedang login
                'user' => $user,

                // Mengirimkan daftar role yang dimiliki user menggunakan metode getRoleNames()
                // Metode ini berasal dari Spatie Role Permission
                'roles' => $user->getRoleNames(),
            ]
        ]);
    })->name('dashboard');

    Route::middleware('role:Admin')->prefix('admin')->group(function () {

        Route::get('/dashboard', function () {
            // Mendapatkan data user yang sedang login menggunakan helper auth()
            $user = auth()->user();
            return Inertia::render('Dashboard', [
                'auth' => [
                    // Mengirimkan data user yang sedang login
                    'user' => $user,

                    // Mengirimkan daftar role yang dimiliki user menggunakan metode getRoleNames()
                    // Metode ini berasal dari Spatie Role Permission
                    'roles' => $user->getRoleNames(),
                ]
            ]);
        })->name('dashboard-admin');

        Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
        Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

        Route::resource('category', CategoryController::class);
        Route::resource('manage-role', RoleController::class);
        Route::post('/upload/image', [ArticleController::class, 'uploadImageContent']);

        Route::get('list-users', [RoleController::class, 'listUsers'])->name('listUsers');
        Route::get('set-role/{id}', [RoleController::class, 'setRole'])->name('setRole');
        Route::post('assign-role/{id}', [RoleController::class, 'assignRole'])->name('assignRole');
        Route::delete('/user/{id}/role/{roleId}', [RoleController::class, 'removeRole'])->name('removeRole');
    });

    Route::middleware('role:Admin|Author')->group(function () {
        Route::resource('article', ArticleController::class);
    });
});

require __DIR__ . '/auth.php';
