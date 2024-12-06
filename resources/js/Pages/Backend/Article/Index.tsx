import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import Authenticated from '@/Layouts/AuthenticatedLayout'
import { Head, Link, router } from '@inertiajs/react'
import React from 'react'
import { toast } from 'sonner'
import { Article, PageProps } from '@/types'
import { ColumnDef } from '@tanstack/react-table'
import DataTable from '@/components/datatable'
import { Input } from '@/components/ui/input'


interface ArticleIndexProps extends PageProps {
    articles: {
        data: Article[],
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        path: string;
        prev_page_url: string | null;
        next_page_url: string | null;
    }
}

export default function Index({ auth, articles }: ArticleIndexProps) {

    // Fungsi delete data category yang akan dijalankan saat AlertDialogAction di klik
    const handleDelete = (id: number) => {
        router.delete(route('article.destroy', id), {
            onSuccess: () => {
                toast.success('Article deleted');
            },
            onError: () => {
                toast.error('Fail to delete article');
            }
        })
    }

    const columns: ColumnDef<Article>[] = [
        {
            id: 'number',
            header: 'No',
            cell: ({ row }) => {
                const index = row.index + 1;
                const number = (articles.current_page - 1) * articles.per_page + index;
                return <span>{number}</span>
            }
        },
        {
            accessorKey: "title",
            header: "Judul Artikel"
        },
        {
            accessorKey: "category.article",
            header: "Kategori Artikel",
            cell: ({ row }) => row.original.category.title || " No Category"
        },
        {
            accessorKey: "image",
            header: "Cover Image",
            cell: ({ row }) => {
                const imageFile = row.original.image
                return (
                    <img src={imageFile} alt={row.original.title} />
                )
            }
        },
        {
            id: 'actions',
            header: 'Options',
            cell: ({ row }) => {
                const article = row.original;

                return (
                    <div className='flex space-x-2'>
                        <Button
                            variant={"default"}
                            size={"sm"}
                            onClick={() => {
                                router.visit(route("category.edit", article.id))
                            }}
                        >
                            Edit
                        </Button>

                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="sm">Delete</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete your
                                        account and remove your data from our servers.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDelete(article.id)}>
                                        Continue
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                )
            }
        }
    ]

    return (
        <Authenticated user={auth.user}>
            <Head title='List Article' />
            <div className='flex justify-center items-center my-10'>
                <Card className='max-w-xl w-full h-full'>

                    <CardContent>
                        <DataTable<Article>
                            data={articles.data}
                            columns={columns}
                            paginationData={articles}
                            actionInputSearch={
                                <Input
                                    placeholder='Search...'
                                    className='max-w-sm'
                                    onChange={(e) => {
                                        const query = e.target.value;
                                        router.get(route("article.index"), { search: query }, { preserveState: true })
                                    }}
                                />
                            }
                            actionButton={
                                <Button size={"sm"} className='mx-2'>
                                    <Link href={route("article.create")}>
                                        Create New Article
                                    </Link>
                                </Button>
                            }
                        />
                    </CardContent>
                </Card>
            </div>
        </Authenticated>
    )
}
