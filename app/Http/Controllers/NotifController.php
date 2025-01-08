<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class NotifController extends Controller
{
    /**
     * Menandai notifikasi tertentu sebagai sudah dibaca.
     *
     * @param string $id ID dari notifikasi yang akan ditandai sebagai sudah dibaca.
     * @return \Illuminate\Http\RedirectResponse Redirect kembali ke halaman sebelumnya.
     */
    public function markAsRead($id)
    {
        // Mengambil notifikasi pengguna berdasarkan ID.
        $notification = auth()->user()->notifications()->findOrFail($id);

         // Menandai notifikasi sebagai sudah dibaca.
        $notification->markAsRead();

         // Mengembalikan pengguna ke halaman sebelumnya setelah notifikasi ditandai.
        return redirect()->back();
    }
}
