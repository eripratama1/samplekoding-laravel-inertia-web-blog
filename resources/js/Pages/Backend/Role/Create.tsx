import InputError from '@/Components/InputError'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Authenticated from '@/Layouts/AuthenticatedLayout'
import { Head, useForm } from '@inertiajs/react'
import React, { FormEventHandler } from 'react'
import { toast } from 'sonner'
import { PageProps } from '@/types'

export default function Create({ auth }: PageProps) {

    // Inisialisasi form menggunakan useForm dengan nilai awal untuk field 'name' string kosong
    const { data, setData, post, processing, errors } = useForm({
        name: '',
    });

    // Fungsi untuk menangani submit form
    const submitData: FormEventHandler = (e) => {
        e.preventDefault()

        // Mengirim data form ke server menggunakan fungsi 'post'
        post(route('manage-role.store'), {
            // Callback yang dijalankan jika pengiriman berhasil
            onSuccess: () => {
                toast.success('New Role added');
            },
            // Callback yang dijalankan jika pengiriman gagal
            onError: () => {
                toast.error('failed to added role');
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
                                            name='title'
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            className='w-full my-3'
                                            disabled={processing}
                                        />
                                        <InputError message={errors.name} />
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
