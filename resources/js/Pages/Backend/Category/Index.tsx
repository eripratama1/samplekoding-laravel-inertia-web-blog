import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import Authenticated from '@/Layouts/AuthenticatedLayout'
import { Category } from '@/types'
import { Head, Link, router } from '@inertiajs/react'
import React from 'react'
import { toast } from 'sonner'

interface CategoryIndexProps {
    category: Category[]
}

export default function Index({ category }: CategoryIndexProps) {

    console.log('result props category', category);

    // Fungsi delete data category yang akan dijalankan saat AlertDialogAction di klik
    const handleDelete = (id: number) => {
        router.delete(route('category.destroy', id), {
            onSuccess: () => {
                toast.success('Category deleted');
            },
            onError: () => {
                toast.error('Category deleted');
            }
        })
    }

    return (
        <Authenticated>
            <Head title='List Kategori' />
            <div className='flex justify-center items-center my-10'>
                <Card className='max-w-xl w-full h-full'>
                    <div className='flex justify-between'>
                        <CardHeader>List Kategori</CardHeader>
                        <Button className='my-4 mx-4'>
                            <Link href={route('category.create')}>
                                Add new Category
                            </Link>
                        </Button>
                    </div>
                    <CardContent>
                        <Table>

                            <TableHeader>
                                <TableRow>
                                    <TableHead>No</TableHead>
                                    <TableHead>Nama Kategori</TableHead>
                                    <TableHead>Options</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {category.map((category, index) => (
                                    <TableRow key={category.id}>
                                        <TableCell className="font-medium">{index + 1}</TableCell>
                                        <TableCell className="font-medium">{category.title}</TableCell>
                                        <TableCell className='flex gap-1'>
                                            <Button size={"sm"}>
                                                <Link href={route('category.edit', category.id)}>Edit</Link>
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
                                                        <AlertDialogAction onClick={() => handleDelete(category.id)}>
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
