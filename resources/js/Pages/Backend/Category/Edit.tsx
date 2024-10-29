import InputError from '@/Components/InputError'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Authenticated from '@/Layouts/AuthenticatedLayout'
import { Category } from '@/types'
import { Head, useForm } from '@inertiajs/react'
import React, { FormEventHandler } from 'react'
import { toast } from 'sonner'

interface CategoryEditProps {
    category: Category
}

export default function Edit({ category }: CategoryEditProps) {

    // Inisialisasi form menggunakan useForm dengan nilai awal untuk field 'title' dari props category
    // Dan menambhkan method PUT
    const { data, setData, post, processing, errors } = useForm({
        title: category.title,
        _method: 'PUT'
    });

    // Fungsi untuk menangani submit form
    const submitData: FormEventHandler = (e) => {
        e.preventDefault()

        // Mengirim data form ke server menggunakan fungsi 'post'
        post(route('category.update', category.id), {
            // Callback yang dijalankan jika pengiriman berhasil
            onSuccess: () => {
                toast.success('Category updated');
            },
            // Callback yang dijalankan jika pengiriman gagal
            onError: () => {
                toast.error('failed to update category');
            }
        })
    }

    return (
        <Authenticated>
            <Head title='Update Category' />
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
                                        <InputError message={errors.title} />
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
