import InputError from '@/Components/InputError'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Authenticated from '@/Layouts/AuthenticatedLayout'
import { Head, useForm } from '@inertiajs/react'
import React, { FormEventHandler } from 'react'
import { toast } from 'sonner'

export default function Create() {

    // Inisialisasi form menggunakan useForm dengan nilai awal untuk field 'title' string kosong
    const { data, setData, post, processing, errors } = useForm({
        title: '',
    });

    // Fungsi untuk menangani submit form
    const submitData: FormEventHandler = (e) => {
        e.preventDefault()

         // Mengirim data form ke server menggunakan fungsi 'post'
        post(route('category.store'),{
            // Callback yang dijalankan jika pengiriman berhasil
            onSuccess:() => {
                toast.success('New Category added');
            },
            // Callback yang dijalankan jika pengiriman gagal
            onError:() => {
                toast.error('failed to added category');
            }
        })
    }

    return (
        <Authenticated>
            <Head title='Create new Category' />
            <div className='flex justify-center items-center my-6'>
                <Card className='max-w-lg w-full'>
                    <CardContent>
                        <div className='py-12'>
                            <div className='mx-auto sm:px-6 lg:px-8'>
                                <form className='space-y-6' onSubmit={submitData}>
                                    <div className='grid gap-2'>
                                        <Label>Category Name</Label>
                                        <Input
                                            name='title'
                                            value={data.title}
                                            onChange={(e) => setData('title', e.target.value)}
                                            className='w-full my-3'
                                            disabled={processing}
                                        />
                                        <InputError message={errors.title}/>
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
