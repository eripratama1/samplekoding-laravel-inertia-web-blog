import { Skeleton } from '@/components/ui/skeleton';
import BlogLayout from '@/Layouts/BlogLayout'
import { Category, Notifications, PageProps } from '@/types'
import { Head, Link } from '@inertiajs/react';
import React, { useEffect, useState } from 'react'

interface CategoryProps extends PageProps {
    categories: Category[],
    notifications?: Notifications[]
}

export default function Categories({ categories, auth, notifications = [] }: CategoryProps) {

    console.log("cek props", categories);

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 500)
        return () => clearTimeout(timer)
    }, [])

    return (
        <BlogLayout auth={auth} notifications={notifications}>
            <Head title='Categories' />
            <div className='container mx-auto p-4'>
                {loading ? (
                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
                        {Array.from({ length: categories.length }).map((_, index) => (
                            <div
                                key={index}
                                className='bg-white p-4 rounded-lg shadow-md hover:bg-blue-500
                        hover:text-white hover:scale-105 hover:-translate-y-2 hover:cursor-pointer
                        transform transition-all duration-300 flex items-center justify-center text-center h-40'>
                                <Skeleton className='w-full h-full' />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
                        {categories.map((category, index) => (
                            <div
                                key={index}
                                className='bg-white p-4 rounded-lg shadow-md hover:bg-blue-500
                        hover:text-white hover:scale-105 hover:-translate-y-2 hover:cursor-pointer transform
                        transition-all duration-300
                        flex items-center justify-center text-center h-40'>
                                <Link href={route('articlesByCategory', category.slug)}>
                                    <h2 className='text-4xl text-nowrap text-stone-700 font-extrabold'>
                                        {category.title}
                                    </h2>
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </BlogLayout>
    )
}
