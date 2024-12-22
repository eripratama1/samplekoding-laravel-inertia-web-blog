import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import BlogLayout from '@/Layouts/BlogLayout'
import { Article, PageProps } from '@/types'
import { Head, Link } from '@inertiajs/react'
import React, { useEffect, useState } from 'react'
import parse from 'html-react-parser';

interface DetailArticleProps extends PageProps {
    article: Article;
    relatedArticles: Article[]
}

export default function DetailArticle({ article, relatedArticles,auth }: DetailArticleProps) {

    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1000)
        return () => clearTimeout(timer)
    }, [])

    return (
        <BlogLayout auth={auth}>
            <Head title={article.title} />
            <div className='container mx-auto flex flex-col lg:flex-row gap-4 px-4 lg:px-6'>
                <div className='w-full lg:w-9/12'>
                    <div className='grid gap-4'>
                        <Card className='h-full max-h-[1000vh] overflow-auto'>
                            <CardHeader>
                                <h1 className='text-4xl font-bold mb-2 text-center'>
                                    {isLoading ? (
                                        <Skeleton className='h-8 w-full max-w-xs mx-auto' />
                                    ) : (
                                        article.title
                                    )}
                                </h1>

                                <div className='flex justify-between items-center mb-4'>
                                    <div>
                                        <p className='text-sm text-gray-500'>
                                            {isLoading ? (
                                                <Skeleton className='h-8 w-full max-w-xs mx-auto' />
                                            ) : (
                                                <>
                                                    Kategori : {article.category.title}
                                                </>
                                            )}
                                        </p>

                                        <p className='text-sm text-gray-500'>
                                            {isLoading ? (
                                                <Skeleton className='h-8 w-full max-w-xs mx-auto' />
                                            ) : (
                                                <>
                                                    Tanggal Publish : {article.created_at}
                                                </>
                                            )}
                                        </p>
                                    </div>

                                    <div className='ml-auto'>
                                        {isLoading ? (
                                            <Skeleton className='w-12 h-12 rounded-full' />
                                        ) : (
                                            <img
                                                src="https://placehold.co/600x400"
                                                alt="author"
                                                className='w-12 h-12 rounded-full object-cover'
                                            />
                                        )}
                                    </div>
                                </div>
                                <hr className='my-10' />
                                {isLoading ? (
                                    <Skeleton className='w-full max-w-xs mx-auto' />
                                ) : (
                                    <img
                                        src={article.image ? article.image : "https://placehold.co/600x400"}
                                        alt={article.slug}
                                        className='w-full object-cover rounded-md'
                                    />
                                )}
                            </CardHeader>

                            <CardContent>
                                <div className='prose max-w-full'>
                                    {isLoading ? (
                                        <Skeleton className='h-40 w-full' />
                                    ) : (
                                        <p className='text-justify leading-8'>
                                            {parse(article.content)}
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <div className='mt-6'>
                            <div className='text-center'>
                                form komentar
                            </div>
                        </div>
                    </div>
                </div>

                <div className='w-full lg:w-3/12'>
                    <Card>
                        <CardContent>
                            {isLoading ? (
                                <>
                                    <Skeleton className='h-8 w-40 mb-4 mt-6' />
                                    <Skeleton className='h-6 w-full mb-2 ' />
                                    <Skeleton className='h-6 w-3/4 mb-2' />
                                    <Skeleton className='h-6 w-2/4' />
                                </>
                            ) : relatedArticles.length > 0 ? (
                                <>
                                    <p className='font-semibold mb-2 mt-6 text-3xl'>
                                        Artikel Lainnya
                                    </p>
                                    <ul>
                                        {relatedArticles.map((relatedArticle) => (
                                            <li className='mb-2' key={relatedArticle.id}>
                                                <Link
                                                    href={route('read', relatedArticle.slug)}
                                                >
                                                    {relatedArticle.title}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            ) : (
                                <p className='text-gray-500 mt-6'>
                                    Tidak ada artikel terkait
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </BlogLayout>
    )
}
