<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        Role::create(['name' => 'Admin']);
        Role::create(['name' => 'Author']);

        $user = User::factory()->create([
            'name' => 'Sample Koding',
            'email' => 'samplekoding@gmail.com',
        ]);

        $user->assignRole('Admin');
    }
}
