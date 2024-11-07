import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import Authenticated from '@/Layouts/AuthenticatedLayout'
import { Head, Link, router } from '@inertiajs/react'
import React from 'react'
import { toast } from 'sonner'
import { Category, PageProps, Role } from '@/types'

// Mendefinisikan interface 'RoleIndexProps' lalu memperluas / extends ke interface 'PageProps'
// Interface ini mendefinisikan properti yang akan diterima komponen, termasuk 'role' dan 'auth' dari PageProps
interface RoleIndexProps extends PageProps {
    // Properti 'role' bertipe array dari interface 'Role'
    // Array object ini berisi daftar kategori yang akan ditampilkan di halaman
    role: Role[]
}

export default function Index({ role, auth }: RoleIndexProps) {

    // Fungsi delete data role yang akan dijalankan saat AlertDialogAction di klik
    const handleDelete = (id: number) => {
        router.delete(route('manage-role.destroy', id), {
            onSuccess: () => {
                toast.success('Role deleted');
            },
            onError: () => {
                toast.error('Failed to delete role');
            }
        })
    }

    return (
        <Authenticated user={auth.user}>
            <Head title='List Role' />
            <div className='flex justify-center items-center my-10'>
                <Card className='max-w-xl w-full h-full'>
                    <div className='flex justify-between'>
                        <CardHeader>List Role</CardHeader>
                        <Button className='my-4 mx-4'>
                            <Link href={route('manage-role.create')}>
                                Add new Role
                            </Link>
                        </Button>
                    </div>
                    <CardContent>
                        <Table>

                            <TableHeader>
                                <TableRow>
                                    <TableHead>No</TableHead>
                                    <TableHead>Nama Role</TableHead>
                                    <TableHead>Options</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {role.map((role, index) => (
                                    <TableRow key={role.id}>
                                        <TableCell className="font-medium">{index + 1}</TableCell>
                                        <TableCell className="font-medium">{role.name}</TableCell>
                                        <TableCell className='flex gap-1'>
                                            <Button size={"sm"}>
                                                <Link href={route('manage-role.edit', role.id)}>Edit</Link>
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
                                                        <AlertDialogAction onClick={() => handleDelete(role.id)}>
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
