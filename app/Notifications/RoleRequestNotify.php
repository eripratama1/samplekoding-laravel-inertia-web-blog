<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class RoleRequestNotify extends Notification
{
    use Queueable;

    /**
     * Properti $user untuk menyimpan data pengguna yang terkait dengan notifikasi.
     * Properti $actionType untuk menentukan jenis aksi yang memicu notifikasi.
     * Contoh: 'request' atau 'grant'.
     */
    protected $user;
    protected $actionType;

    /**
     * Konstruktor untuk menginisialisasi notifikasi baru.
     * $user Data user yang terkait dengan notifikasi.
     *  $actionType Jenis aksi yang memicu notifikasi (misalnya: 'request', 'grant').
     */
    public function __construct($user, $actionType)
    {
         // Menyimpan data user ke properti $user.
        $this->user = $user;
        // Menyimpan jenis aksi ke properti $actionType.
        $this->actionType = $actionType;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->line('The introduction to the notification.')
            ->action('Notification Action', url('/'))
            ->line('Thank you for using our application!');
    }

    /**
     * Get the array representation of the notification.
     *
     * * Mengonversi notifikasi menjadi array untuk keperluan penyimpanan atau pengiriman.
     * Parameter:
     * - object $notifiable: Objek yang akan menerima notifikasi.
     * @return array<string, mixed>
     */

    public function toArray(object $notifiable): array
    {
        /**
         * Jika actionType adalah 'request', kembalikan array dengan pesan permintaan role author.
         * Termasuk informasi tentang user yang meminta.
         */
        if ($this->actionType === 'request') {
            return [
                'message' => $this->user->name . ' has requested the author role',
                'type' => 'role_request', // Tipe notifikasi untuk permintaan role.
                'user_id' => $this->user->id // ID user yang melakukan permintaan.
            ];

            /**
             * Jika actionType adalah 'grant', kembalikan array dengan pesan pemberian role author.
             * Termasuk informasi tentang user yang diberikan role.
             */
        } elseif ($this->actionType === 'grant') {
            return [
                'message' => 'You have been assigned the author role by admin',
                'type' => 'role_granted', // Tipe notifikasi untuk pemberian role.
                'user_id' => $this->user->id // ID user yang diberikan role.
            ];
        }
    }
}
