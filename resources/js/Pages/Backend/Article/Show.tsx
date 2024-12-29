import Authenticated from '@/Layouts/AuthenticatedLayout';
import { Article, Comment, PageProps } from '@/types'
import { Head, useForm } from '@inertiajs/react';
import React, { useEffect, useState } from 'react'
import { formatDistanceToNow } from "date-fns"
import { id } from "date-fns/locale"
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import parse from 'html-react-parser';
import { Button } from '@/components/ui/button';

interface ShowArticleProps extends PageProps {
    article: Article;
    comments: Comment[]
}

interface RenderCommentProps {
    commentsMap: Map<number, Comment[]>
    parentId: number;
    level?: number;
    handleReply: (parentId: number | null) => void;
    replyTo?: number | null;
    articleId: number;
}

interface ReplyFormProps {
    articleId: number;
    parentId: number;
    handleCancel: () => void;
}

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
        <>
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

                {/*
                    Kode dibawah ini untuk menampilkan form reply comment
                    ketika user menekan tombol reply pada comment tertentu
                    dengan menggunakan kondisi jika replyTo sama dengan id comment
                    maka form reply comment akan ditampilkan
                */}
                {replyTo === comment.id && (
                    <ReplyForm
                        parentId={comment.id}
                        articleId={articleId}
                        handleCancel={() => handleReply(null)}
                    />
                )}
            </div>
            <div className='ml-4 mt-4'>
                {/* Komponen dibawah ini akan menampilkan reply comment
                    dengan menggunakan fungsi rekursif.Level akan bertambah 1
                    setiap kali fungsi dipanggil
                */}
                <RenderComment
                    commentsMap={commentsMap}
                    parentId={comment.id}
                    level={(level ?? 0) + 1}
                    handleReply={handleReply}
                    replyTo={replyTo}
                    articleId={articleId}
                />
            </div>
        </>
    ))
}

// Fungsi ReplyForm untuk menampilkan form reply comment yang berisi textarea dan button submit dan cancel
// dengan menggunakan props articleId, parentId, dan handleCancel yang berisi fungsi untuk menutup form reply comment
// Fungsi handleSubmit akan mengirimkan data comment ke endpoint /comments dengan method POST
// Fungsi handleChange akan mengubah data content pada form textarea
function ReplyForm({ articleId, parentId, handleCancel }: ReplyFormProps) {
    const { data, setData, post, reset } = useForm({
        content: "",
        parent_id: parentId,
        article_id: articleId
    })

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setData("content", e.target.value)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        post("/comments", {
            onSuccess: () => reset("content")
        })
        handleCancel()
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
            <div className='flex justify-end gap-2 mt-2'>
                <Button className='mt-2 px-4 py-3 bg-indigo-500 text-white rounded-md hover:bg-indigo-600'>
                    Submit Reply
                </Button>
                <Button className='mt-2 px-4 py-3 bg-slate-500 text-white rounded-md hover:bg-slate-600'
                    onClick={handleCancel}>
                    Cancel
                </Button>
            </div>
        </form>
    )
}

export default function Show({ auth, article, comments = [] }: ShowArticleProps) {

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
        <Authenticated user={auth.user}>
            <Head title={article.title} />

            <div className='container mx-auto flex flex-col lg:flex-row gap-4 px-4 lg:px-6'>
                <div className='w-full'>
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
                                        Reply a comment
                                    </h2>


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


            </div>
        </Authenticated>
    )
}
