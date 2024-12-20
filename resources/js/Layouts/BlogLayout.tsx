import ResponsiveNavLink from '@/Components/ResponsiveNavLink'
import SearchBar from '@/components/searchbar'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Link } from '@inertiajs/react'
import { Bell, Menu, Newspaper, User2 } from 'lucide-react'
import React from 'react'

export default function BlogLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className='flex min-h-screen w-full flex-col'>
            <header className='sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6'>
                <nav className='hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6'>
                    <Link
                        href='#'
                        className='flex items-center gap-2 text-lg font-semibold md:text-base'
                    >
                        <Newspaper className='size-4' />
                        <span className='block text-sm md:text-base lg:text-lg'>
                            Blog
                        </span>
                    </Link>

                    <ResponsiveNavLink
                        href={route('home')}
                        active={route().current("home")}
                        className='flex items-center gap-3 rounded-lg px-3 py-2 my-1 text-muted-foreground transition-all hover:text-primary text-nowrap'
                    >
                        Article
                    </ResponsiveNavLink>

                    <ResponsiveNavLink
                        href={route('categories')}
                        active={route().current("categories")}
                        className='flex items-center gap-3 rounded-lg px-3 py-2 my-1 text-muted-foreground transition-all hover:text-primary text-nowrap'
                    >
                        Categories
                    </ResponsiveNavLink>
                </nav>

                {/* Mobile menu nav */}
                <Sheet>
                    <SheetTrigger asChild>
                        <Button
                            variant={"outline"}
                            className='shrink-0 md:hidden'
                        >
                            <Menu className='size-5' />
                            <span className='sr-only'>Toogle navigation menu</span>
                        </Button>
                    </SheetTrigger>

                    <SheetTitle>
                        <span className='sr-only'>Toogle navigation menu</span>
                    </SheetTitle>
                    <SheetContent side={"left"}>
                        <nav className='grid gap-6 text-lg font-medium'>
                            <Link
                                href='#'
                                className='flex items-center gap-2 text-lg font-semibold md:text-base'
                            >
                                <Newspaper className='size-4' />
                                <span className='block text-sm md:text-base lg:text-lg'>
                                    Blog
                                </span>
                            </Link>

                            <ResponsiveNavLink
                                href='#'
                                className='flex items-center gap-3 rounded-lg px-3 py-2 my-1 text-muted-foreground transition-all hover:text-primary text-nowrap'
                            >
                                Article
                            </ResponsiveNavLink>
                        </nav>
                    </SheetContent>
                </Sheet>
                {/* Mobile menu nav */}


                <div className='flex  w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4'>
                    <div className='w-full flex justify-end'>
                        <SearchBar/>
                    </div>

                    <div>
                        <Bell className='size-4'/>
                    </div>

                    <div>
                        <User2 className='size-4'/>
                    </div>
                </div>
            </header>

            <main className='flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8'>
                {children}
            </main>

            <footer className='mt-auto w-full py-3 bg-gray-800 text-center text-white'>
                <p>
                    &copy; 2024 Web blog laravel inertia
                </p>
            </footer>
        </div>
    )
}
