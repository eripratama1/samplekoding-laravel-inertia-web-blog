import InputError from '@/Components/InputError'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Head, router } from '@inertiajs/react'
import { FormEventHandler, useState } from 'react'
import { toast } from 'sonner'
import { PageProps, Role, User } from '@/types'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Authenticated from '@/Layouts/AuthenticatedLayout'

interface AssignRoleProps extends PageProps {
    user: User;
    roles: Role[];
    userRole: Role[];
}
export default function AssignRole({ auth, user, roles, userRole }: AssignRoleProps) {

    // Menambahkan sebuah state untuk menampung data role yang ada
    const [selectedRole, setSelectedRole] = useState<string | undefined>(userRole.length > 0 ? userRole[0].name : '');
    // Fungsi untuk menangani submit form

    const handleChange = (roleName: string) => {
        setSelectedRole(roleName);
    }

    const submitData: FormEventHandler = (e) => {
        e.preventDefault()
        router.post(route('assignRole', user.id), {
            roles: selectedRole ? [selectedRole] : [],
        }, {
            onSuccess: () => {
                toast.success('Successfully assign role to user')
            },
            onError: () => {
                toast.error('Failed to assign role');
            }
        })
    }

    return (
        <Authenticated user={auth.user}>
            <Head title='Create new Role' />
            <div className='flex justify-center items-center my-6'>
                <Card className='max-w-lg w-full'>
                    <CardContent>
                        <div className='py-12'>
                            <div className='mx-auto sm:px-6 lg:px-8'>
                                <form className='space-y-6' onSubmit={submitData}>
                                    <div className='grid gap-2'>
                                        <Label>Role Name</Label>
                                        <Input
                                            value={user.name}
                                            readOnly
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="" className='block text-sm font-medium text-gray-700'>
                                            Assign Role
                                        </label>
                                        <Select
                                            name='roles'
                                            onValueChange={handleChange}
                                            defaultValue={selectedRole}
                                            value={selectedRole}
                                        >
                                            <SelectTrigger className='w-full'>
                                                <SelectValue placeholder="Select a role" />
                                            </SelectTrigger>

                                            <SelectContent>
                                                <SelectGroup>
                                                    {roles.map((role) => (
                                                        <SelectItem key={role.id.toString()} value={role.name}>
                                                            {role.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <Button className='w-full'>Submit</Button>
                                </form>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </Authenticated>
    )
}
