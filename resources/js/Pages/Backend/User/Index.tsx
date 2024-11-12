import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import Authenticated from '@/Layouts/AuthenticatedLayout'
import { Head, Link, router } from '@inertiajs/react'
import { toast } from 'sonner'
import { PageProps, Role, User } from '@/types'

// Mendefinisikan interface 'UserIndexProps' lalu memperluas / extends ke interface 'PageProps'
// Interface ini mendefinisikan properti yang akan diterima komponen, termasuk 'user' dan 'auth' dari PageProps
interface UserIndexProps extends PageProps {
    // Properti 'role' bertipe array dari interface 'Role'
    // Array object ini berisi daftar kategori yang akan ditampilkan di halaman
    user: User[]
}

export default function Index({ user, auth }: UserIndexProps) {

    // Fungsi remove role dari user yang akan dijalankan saat AlertDialogAction di klik
    const handleDelete = (userId: number, roleId: number) => {
        router.delete(route('removeRole', { id: userId, roleId: roleId }), {
            onSuccess: () => {
                toast.success('Role removed')
            },
            onError: () => {
                toast.error('Failed to remove role')
            }
        })
    }

    return (
        <Authenticated user={auth.user}>
            <Head title='List Role' />
            <div className='flex justify-center items-center my-10'>
                <Card className='max-w-xl w-full h-full'>

                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>No</TableHead>
                                    <TableHead>Nama User</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Options</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {user.map((user, index) => (
                                    <TableRow key={user.id}>
                                        <TableCell className="font-medium">{index + 1}</TableCell>
                                        <TableCell className="font-medium text-nowrap">{user.name}</TableCell>
                                        <TableCell className="font-medium">
                                            {user.roles.length > 0 ? (
                                                user.roles.map((role: Role) => (
                                                    <span key={role.id}>
                                                        {role.name}
                                                    </span>
                                                ))
                                            ) : (
                                                "User belum memiliki role"
                                            )}
                                        </TableCell>
                                        <TableCell className='flex gap-1'>
                                            <Button size={"sm"}>
                                                <Link href={route('setRole', user.id)}>
                                                    Assign Role
                                                </Link>
                                            </Button>

                                            {user.roles.length > 0 && user.roles.map((role: Role) => (
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="destructive" size="sm">Remove Role</Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                This action cannot be undone. It will remove the role '{role.name}' from
                                                                '{user.name}'
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => handleDelete(user.id, role.id)}>
                                                                Continue
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            ))}
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
