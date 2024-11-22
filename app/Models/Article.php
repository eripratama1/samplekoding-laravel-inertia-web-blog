<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Article extends Model
{
    use HasFactory;
    protected $guarded = [];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function comments()
    {
        return $this->hasMany(Comment::class)->whereNull('parent_id');
    }

    /**
     * Kode ini memastikan bahwa nilai atribut image selalu berupa URL yang valid ke file gambar
     * atau gambar placeholder
     */
    protected function image(): Attribute
    {
        return Attribute::make(
            // Getter untuk atribut image
            // Jika atribut memiliki nilai
            get: fn($value) => $value
                ?
                 // Buat URL lengkap ke lokasi file gambar di storage
                asset('storage/' . ltrim(str_replace('public/', '', $value) . '/'))
                 // Jika tidak ada nilai, kembalikan URL gambar placeholder
                : 'https://placehold.co/600x400'
        );
    }
}
