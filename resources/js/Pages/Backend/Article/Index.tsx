import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import Authenticated from '@/Layouts/AuthenticatedLayout'
import { Head, Link, router } from '@inertiajs/react'
import React from 'react'
import { toast } from 'sonner'
import { Article, PageProps } from '@/types'


interface ArticleIndexProps extends PageProps {
    articles: Article[]
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

    return (
        <Authenticated user={auth.user}>
            <Head title='List Article' />
            <div className='flex justify-center items-center my-10'>
                <Card className='max-w-xl w-full h-full'>
                    <div className='flex justify-between'>
                        <CardHeader>List Article</CardHeader>
                        <Button className='my-4 mx-4'>
                            <Link href={route('article.create')}>
                                Add new Article
                            </Link>
                        </Button>
                    </div>
                    <CardContent>
                        <Table>

                            <TableHeader>
                                <TableRow>
                                    <TableHead>No</TableHead>
                                    <TableHead>Judul Artikel</TableHead>
                                    <TableHead>Kategori Artikel</TableHead>
                                    <TableHead>Cover Image</TableHead>
                                    <TableHead>Options</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {articles.map((article, index) => (
                                    <TableRow key={article.id}>
                                        <TableCell className="font-medium">{index + 1}</TableCell>
                                        <TableCell className="font-medium">{article.title}</TableCell>
                                        <TableCell className="font-medium">{article.category.title}</TableCell>
                                        <TableCell className="font-medium">
                                            <img src={article.image} alt={article.title} width="100px" />
                                        </TableCell>
                                        <TableCell className='flex gap-1'>
                                            <Button size={"sm"}>
                                                <Link href={route('article.edit', article.id)}>Edit</Link>
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

                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>

                        </Table>
                    </CardContent>
                </Card>
            </div>
        </Authenticated>
    )
}
