import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Button } from '@/components/ui/button';
import { DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Link, usePage } from '@inertiajs/react';
import { CircleUser, Menu, Package2, Search } from 'lucide-react';
import { PropsWithChildren, ReactNode, useState } from 'react';
import { User } from '@/types';


// Interface ini bertujuan untuk menentukan tipe props yang akan diterima oleh komponen autentikasi
interface AuthenticatedProps extends PropsWithChildren {
    // Properti 'user' bersifat wajib, bertipe 'User' yang kita dapatkan dari file
    // Interface pada filke index.d.ts (resources/js/types)
    // 'User' berisi data seperti nama, email, dll.

    // Properti opsional 'header' bertipe 'ReactNode'
    // 'ReactNode' memungkinkan berbagai tipe elemen React atau elemen HTML yang bisa dipakai sebagai header
    user: User
    header?: ReactNode
}
export default function Authenticated({ header, children, user }: AuthenticatedProps) {

    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    // Mendeklarasikan variabel 'isAdmin' yang akan menyimpan nilai true atau false
    const isAdmin = user.roles?.some(role => role.name === 'Admin');
    const isAuthor = user.roles?.some(role => role.name === 'Author');

    // Mengakses properti 'roles' dari objek 'user'
    // Operator ?. (optional chaining) digunakan untuk mencegah error jika 'roles' bernilai undefined atau null
    // Jika 'roles' undefined atau null, hasilnya otomatis akan menjadi undefined, dan 'isAdmin' akan bernilai false

    // Metode .some() memeriksa apakah ada setidaknya satu elemen dalam array 'roles'
    // Fungsi callback di dalam .some() akan mengecek setiap 'role' dalam array untuk melihat apakah
    // ada peran yang memiliki properti 'name' dengan nilai 'Admin'

    // Jika ada peran dengan 'name' 'Admin', maka .some() akan mengembalikan true, sehingga 'isAdmin' akan bernilai true
    // Jika tidak ada atau 'roles' kosong, maka 'isAdmin' akan bernilai false
    // console.log("User Data", isAdmin, user);

    console.log("Result isAuthor", isAuthor);


    return (

        <div className='flex min-h-screen w-full flex-col'>
            <header className='sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6'>
                <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-lg font-semibold md:text-base"
                    >
                        <Package2 className="h-6 w-6" />
                        <span className="sr-only">Acme Inc</span>
                    </Link>
                    <ResponsiveNavLink
                        href={route('dashboard')}
                        className="text-foreground transition-colors hover:text-foreground"
                        active={route().current('dashboard')}
                    >
                        Dashboard
                    </ResponsiveNavLink>

                    {isAdmin && (
                        <>
                            <ResponsiveNavLink
                                href={route('category.index')}
                                className="text-foreground transition-colors hover:text-foreground"
                                active={route().current('category*')}
                            >
                                Categories
                            </ResponsiveNavLink>

                            <ResponsiveNavLink
                                href={route('manage-role.index')}
                                className="text-foreground transition-colors hover:text-foreground text-nowrap"
                                active={route().current('manage-role*')}
                            >
                                Manage Role
                            </ResponsiveNavLink>

                            <ResponsiveNavLink
                                href={route('listUsers')}
                                className="text-foreground transition-colors hover:text-foreground text-nowrap"
                                active={route().current('listUsers*')}
                            >
                                Manage Users
                            </ResponsiveNavLink>



                        </>
                    )}

                    {(isAdmin || isAuthor) && (
                        <ResponsiveNavLink
                            href={route('article.index')}
                            className="text-foreground transition-colors hover:text-foreground"
                            active={route().current('article*')}
                        >
                            Articles
                        </ResponsiveNavLink>
                    )}
                </nav>

                {/* Mobile menu */}
                <Sheet>
                    <SheetTrigger asChild>
                        <Button
                            variant="outline"
                            size="icon"
                            className="shrink-0 md:hidden"
                        >
                            <Menu className="h-5 w-5" />
                            <span className="sr-only">Toggle navigation menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left">
                        <DialogTitle className='sr-only'>Mobile menu</DialogTitle>
                        <DialogDescription className='sr-only'>Mobile menu</DialogDescription>
                        <nav className="grid gap-6 text-lg font-medium">
                            <Link
                                href="#"
                                className="flex items-center gap-2 text-lg font-semibold"
                            >
                                <Package2 className="h-6 w-6" />
                                <span className="sr-only">Acme Inc</span>
                            </Link>
                            <ResponsiveNavLink
                                href={route('dashboard')}
                                className="text-foreground transition-colors hover:text-foreground"
                                active={route().current('dashboard')}
                            >
                                Dashboard
                            </ResponsiveNavLink>

                            {isAdmin && (
                                <>
                                    <ResponsiveNavLink
                                        href={route('category.index')}
                                        className="text-foreground transition-colors hover:text-foreground"
                                        active={route().current('category*')}
                                    >
                                        Categories
                                    </ResponsiveNavLink>

                                    <ResponsiveNavLink
                                        href={route('manage-role.index')}
                                        className="text-foreground transition-colors hover:text-foreground"
                                        active={route().current('manage-role*')}
                                    >
                                        Manage Role
                                    </ResponsiveNavLink>

                                    <ResponsiveNavLink
                                        href={route('listUsers')}
                                        className="text-foreground transition-colors hover:text-foreground text-nowrap"
                                        active={route().current('listUsers*')}
                                    >
                                        Manage Users
                                    </ResponsiveNavLink>
                                </>
                            )}
                        </nav>
                    </SheetContent>
                </Sheet>
                {/* Mobile menu */}

                <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
                    <form className="ml-auto flex-1 sm:flex-initial">
                        <div className="relative">
                        </div>
                    </form>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="secondary" size="icon" className="rounded-full">
                                <CircleUser className="h-5 w-5" />
                                <span className="sr-only">Toggle user menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Settings</DropdownMenuItem>
                            <DropdownMenuItem>Support</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <Link href={route('logout')} method='post'>Logout</Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

            </header>
            <main className='flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8'>{children}</main>
        </div>
    );
}
