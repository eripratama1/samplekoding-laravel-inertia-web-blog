import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import BlogLayout from '@/Layouts/BlogLayout'
import { Article, Comment, PageProps } from '@/types'
import { Head, Link, useForm } from '@inertiajs/react'
import React, { useEffect, useState } from 'react'
import parse from 'html-react-parser';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from "date-fns"
import { id } from "date-fns/locale"

interface DetailArticleProps extends PageProps {
    article: Article;
    relatedArticles: Article[]
    comments?: Comment[]
}

/**
 * Interface CommentFormProps digunakan untuk membuat props pada fungsi CommentForm
 * yang akan digunakan untuk membuat form komentar pada artikel
 * isi dari interface ini adalah articleId, articleSlug, authorId, dan authorName
 * dimana articleId bertipe number yang akan digunakan untuk menyimpan id artikel
 * articleSlug bertipe string yang akan digunakan untuk menyimpan slug artikel
 * authorId bertipe number | undefined yang akan digunakan untuk menyimpan id penulis artikel
 * authorName bertipe string | undefined yang akan digunakan untuk menyimpan nama penulis artikel
 */
interface CommentFormProps {
    articleId: number;
    articleSlug: string;
    authorId: number | undefined;
    authorName: string | undefined;
}

/**
 * Interface ini digunakan untuk membuat props pada fungsi RenderComment
 * yang akan digunakan untuk menampilkan komentar pada artikel
 * isi dari interface ini adalah commentsMap, parentId, level, handleReply, replyTo, dan articleId
 * dimana commentsMap adalah Map<number, Comment[]> yang akan digunakan untuk menyimpan data komentar
 * parentId adalah number yang akan digunakan untuk menyimpan id komentar
 * level adalah number yang akan digunakan untuk menyimpan level komentar
 * handleReply adalah fungsi yang akan digunakan untuk menangani balasan komentar
 * replyTo akan digunakan untuk menyimpan nilai id balasan komentar
 * articleId akan digunakan untuk menyimpan id artikel yang akan dikomentari
 */
interface RenderCommentProps {
    commentsMap: Map<number, Comment[]>
    parentId: number;
    level?: number;
    handleReply: (parentId: number | null) => void;
    replyTo?: number | null;
    articleId: number;
}

/**
 *
 * Interface dibwah ini digunakan untuk membuat props pada fungsi buildCommentTree
 * yang akan digunakan untuk membuat tree komentar pada artikel yang akan ditampilkan pada halaman detail artikel
 * isi dari interface ini adalah comments yang akan digunakan untuk menyimpan data komentar
 * yang akan ditampilkan pada halaman detail artikel tersebut
 *
 */
function buildCommentTree(comments: Comment[]) {
    const commentMap = new Map<number, Comment[]>()
    comments.forEach((comment) => {
        const parentId = comment.parent_id || 0;
        if (!commentMap.has(parentId)) {
            commentMap.set(parentId, [])
        }
        commentMap.get(parentId)?.push(comment)
    })

    return commentMap
}

function RenderComment({ commentsMap, parentId, level, handleReply, replyTo, articleId }: RenderCommentProps) {
    const comments = commentsMap.get(parentId) || []

    return comments.map((comment) => (
        <div key={comment.id} className='mb-4 w-full max-w-7xl'>
            <div className='p-4 border-l-4 border-indigo-500 rounded-md bg-white shadow-sm transition-all hover:shadow-lg
            hover:bg-indigo-200 duration-300'>
                <div className='flex items-center justify-between'>
                    <div className='text-indigo-600 font-semibold text-sm'>
                        {comment.user?.name}
                    </div>
                    <div className='text-xs text-gray-400'>
                        {formatDistanceToNow(new Date(comment.created_at), {
                            addSuffix: true,
                            locale: id
                        })}
                    </div>
                </div>
                <p className='mt-2 text-gray-700'>{comment.content}</p>
                <button className='text-indigo-500 text-sm mt-2 hover:underline'
                    onClick={() => handleReply(comment.id)}
                >
                    Reply
                </button>
            </div>
        </div>
    ))
}

/**
 * Kode ini digunakan untuk membuat form komentar
 *
 * */
function CommentForm({ articleId, articleSlug, authorId, authorName }: CommentFormProps) {
    const { data, setData, post, reset } = useForm({
        content: "",
        article_id: articleId,
        authorId: authorId
    })

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setData("content", e.target.value)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        post('/comments', {
            onSuccess: () => {
                toast.success("comment submitted")
                reset("content")
            },
            onError: (error) => {
                toast.error("failed submit comment", error)
            }

        })
    }

    return (
        <form onSubmit={handleSubmit} className='mb-4'>
            <textarea
                className='w-full p-3 border rounded-md focus:ring focus:ring-indigo-300'
                placeholder='Write your comment...'
                value={data.content}
                onChange={handleChange}
            >
            </textarea>
            <Button className='mt-2 px-4 py-3 bg-indigo-500 text-white rounded-md hover:bg-indigo-600'>
                Submit comment
            </Button>
        </form>
    )
}

export default function DetailArticle({ article, relatedArticles, auth, comments = [] }: DetailArticleProps) {

    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1000)
        return () => clearTimeout(timer)
    }, [])

    const [replyTo, setReplyTo] = useState<number | null>(null)
    const handleReply = (parentId: number | null) => {
        setReplyTo(parentId)
    }
    const commentsMap = buildCommentTree(comments)

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
                            <Card>
                                <CardContent>
                                    <h2 className='text-2xl font-semibold mb-4 mt-4'>
                                        Leave a comment
                                    </h2>

                                    {/*
                                        Komponen berikut akan menampilkan form komentar
                                        dimana kita akan mengirimkan data berupa articleId,
                                        articleSlug,authorId, dan authorName lalu akan mengirimkan
                                        data tersebut ke endpoint /comments dengan method POST
                                        seperti yang sudah kita definisikan pada fungsi CommentForm
                                    */}
                                    <CommentForm
                                        articleId={article.id}
                                        articleSlug={article.slug}
                                        authorName={article.user?.name}
                                        authorId={article.user?.id}
                                    />

                                    {comments.length > 0 ? (
                                        <RenderComment
                                            commentsMap={commentsMap}
                                            parentId={0}
                                            level={0}
                                            handleReply={handleReply}
                                            replyTo={replyTo}
                                            articleId={article.id}
                                        />
                                    ) : (
                                        <p className='text-gray-500'>No Comments yet.</p>
                                    )}
                                </CardContent>
                            </Card>
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
