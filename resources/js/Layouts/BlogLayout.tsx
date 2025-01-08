import { ModeToggle } from '@/components/mode-toggle'
import NotifComponent from '@/components/notifications'
import ResponsiveNavLink from '@/Components/ResponsiveNavLink'
import SearchBar from '@/components/searchbar'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { PageProps } from '@/types'
import { Link } from '@inertiajs/react'
import { Bell, CircleUser, Menu, Newspaper, User2 } from 'lucide-react'
import React from 'react'

interface BlogLayoutProps extends PageProps {
    children: React.ReactNode
}

export default function BlogLayout({ children, auth }: BlogLayoutProps) {
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
                        active={route().current("home") || route().current("read")}
                        className='flex items-center gap-3 rounded-lg px-3 py-2 my-1 text-muted-foreground transition-all hover:text-primary text-nowrap'
                    >
                        Article
                    </ResponsiveNavLink>

                    <ResponsiveNavLink
                        href={route('categories')}
                        active={route().current("categories") || route().current("articlesByCategory")}
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
                                href={route('home')}
                                active={route().current("home") || route().current("read")}
                                className='flex items-center gap-3 rounded-lg px-3 py-2 my-1 text-muted-foreground transition-all hover:text-primary text-nowrap'
                            >
                                Article
                            </ResponsiveNavLink>

                            <ResponsiveNavLink
                                href={route('categories')}
                                active={route().current("categories") || route().current("articlesByCategory")}
                                className='flex items-center gap-3 rounded-lg px-3 py-2 my-1 text-muted-foreground transition-all hover:text-primary text-nowrap'
                            >
                                Categories
                            </ResponsiveNavLink>
                        </nav>
                    </SheetContent>
                </Sheet>
                {/* Mobile menu nav */}


                <div className='flex  w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4'>
                    <div className='w-full flex justify-end'>
                        <SearchBar />
                    </div>

                    <ModeToggle />

                    {auth.user ? (
                        <React.Fragment>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant={"secondary"} size={"icon"} className='rounde-full'>
                                        <CircleUser className='size-5' />
                                        <span className='sr-only'>Toggle user menu</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align='end'>
                                    <DropdownMenuLabel>
                                        <DropdownMenuItem>
                                            <h4>{auth.user?.name}</h4>
                                        </DropdownMenuItem>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                        <Link
                                            href={auth.user.roles?.some(role => role.name === 'Admin') ?
                                                route('dashboard-admin') : route('dashboard')
                                            }
                                            as="button">
                                            {auth.user.roles?.some(role => role.name === 'Admin') ?
                                                'Dashboard Admin' : 'Dashboard'
                                            }
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                        <Link href={route('logout')} method='post' as='button'>
                                            Logout
                                        </Link>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </React.Fragment>
                    ) : (
                        <Link href="/register">
                            <Button>Become an article writer</Button>
                        </Link>
                    )}
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
