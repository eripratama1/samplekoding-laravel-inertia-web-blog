import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import Authenticated from '@/Layouts/AuthenticatedLayout'
import { Head, Link, router } from '@inertiajs/react'
import React from 'react'
import { toast } from 'sonner'
import { Category, Notifications, PageProps } from '@/types'
import DataTable from '@/components/datatable'
import { ColumnDef } from '@tanstack/react-table'
import { Input } from '@/components/ui/input'

// Mendefinisikan interface 'CategoryIndexProps' lalu memperluas / extends ke interface 'PageProps'
// Interface ini mendefinisikan properti yang akan diterima komponen, termasuk 'category' dan 'auth' dari PageProps
interface CategoryIndexProps extends PageProps {
    // Properti 'category' bertipe array dari interface 'Category'
    // Array object ini berisi daftar kategori yang akan ditampilkan di halaman

    // Mnegubah struktur interface dari categoryindexprops dengan menambahkan beberapa nilai
    // untuk menghandle result dari method paginate yang didapat dari CategoryController method index()
    categories: {
        data: Category[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        path: string;
        prev_page_url: string | null;
        next_page_url: string | null;
    },
    notifications?: Notifications[]
}

export default function Index({ categories, auth,notifications = [] }: CategoryIndexProps) {

    // console.log('result props category', category);

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

    const columns: ColumnDef<Category>[] = [
        {
            id: 'number',
            header: 'No',
            cell: ({ row }) => {
                const index = row.index + 1;
                const number = (categories.current_page - 1) * categories.per_page + index;
                return <span>{number}</span>
            }
        },
        {
            accessorKey: "title",
            header: "Title"
        },
        {
            id: 'actions',
            header: 'Options',
            cell: ({ row }) => {
                const category = row.original;

                return (
                    <div className='flex space-x-2'>
                        <Button
                            variant={"default"}
                            size={"sm"}
                            onClick={() => {
                                router.visit(route("category.edit", category.id))
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
                                    <AlertDialogAction onClick={() => handleDelete(category.id)}>
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
        <Authenticated user={auth.user} notifications={notifications}>
            <Head title='List Kategori' />
            <div className='flex justify-center items-center my-10'>
                <Card className='max-w-xl w-full h-full'>
                    <CardContent>
                        <DataTable<Category>
                            data={categories.data}
                            columns={columns}
                            paginationData={categories}
                            actionInputSearch={
                                <Input
                                    placeholder='Search...'
                                    className='max-w-sm'
                                    onChange={(e) => {
                                        const query = e.target.value;
                                        router.get(route("category.index"), { search: query }, { preserveState: true })
                                    }}
                                />
                            }
                            actionButton={
                                <Button size={"sm"} className='mx-2'>
                                    <Link href={route("category.create")}>
                                        Create New Category
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
