import InputError from '@/Components/InputError'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Authenticated from '@/Layouts/AuthenticatedLayout'
import { Head, useForm } from '@inertiajs/react'
import React, { FormEventHandler } from 'react'
import { toast } from 'sonner'
import { Category, PageProps } from '@/types'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CKEditor } from "@ckeditor/ckeditor5-react"
import {
    ClassicEditor,
    Bold,
    Essentials,
    Italic,
    Paragraph,
    Undo,
    Alignment,
    CodeBlock,
    Image,
    ImageToolbar,
    ImageUpload,
    SimpleUploadAdapter,
    ImageResize,
    ImageResizeButtons,
    ImageResizeEditing,
    ImageStyle,
    ImageStyleUI
} from "ckeditor5"

import "ckeditor5/ckeditor5.css";

interface CreateArticleProps extends PageProps {
    category: Category[]
}

export default function Create({ auth, category }: CreateArticleProps) {

    // Inisialisasi form menggunakan useForm dengan nilai awal untuk field 'title' string kosong
    const { data, setData, post, processing, errors } = useForm({
        title: '',
    });

    // Fungsi untuk menangani submit form
    const submitData: FormEventHandler = (e) => {
        e.preventDefault()
    }

    return (
        <Authenticated user={auth.user}>
            <Head title='Post new Article' />
            <div className='flex justify-center items-center my-6'>
                <Card className='max-w-7xl w-full'>
                    <CardContent>
                        <div className='py-12'>
                            <div className='mx-auto sm:px-6 lg:px-8'>
                                <form className='space-y-6' onSubmit={submitData}>
                                    <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>

                                        <div className='grid gap-2'>
                                            <Label>Title</Label>
                                            <Input
                                                name='title'
                                                value={data.title}
                                                onChange={(e) => setData('title', e.target.value)}
                                                className='w-full my-3'
                                                disabled={processing}
                                            />
                                            <InputError message={errors.title} />
                                        </div>

                                        <div className='grid gap-2'>
                                            <Label>Select Category</Label>
                                            <Select>
                                                <SelectTrigger className='w-full'>
                                                    <SelectValue placeholder="Choose category" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        {category.map((category) => (
                                                            <SelectItem
                                                                key={category.id}
                                                                value={category.title}
                                                            >
                                                                {category.title}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                            <InputError message={errors.title} />
                                        </div>

                                        <div className='grid gap-2'>
                                            <Label>Upload Image</Label>
                                            <Input
                                                name='title'
                                                type='file'
                                                value={data.title}
                                                onChange={(e) => setData('title', e.target.value)}
                                                className='w-full my-3'
                                                disabled={processing}
                                            />
                                            <InputError message={errors.title} />
                                        </div>
                                    </div>

                                    <div className='relative z-10'>
                                        <Label>Content Article</Label>
                                        <CKEditor
                                            editor={ClassicEditor}
                                            config={{
                                                toolbar: {
                                                    items: [
                                                        "undo",
                                                        "redo",
                                                        "bold",
                                                        "italic",
                                                        "alignment:left",
                                                        "alignment:center",
                                                        "alignment:right",
                                                        "alignment:justify",
                                                        "codeblock",
                                                        "imageUpload"
                                                    ]
                                                },
                                                plugins: [
                                                    Bold, Essentials, Italic,Alignment,CodeBlock,
                                                    Image,ImageUpload,ImageToolbar,SimpleUploadAdapter,
                                                    ImageResize,ImageResizeButtons
                                                ]
                                            }}
                                        />
                                    </div>

                                    <Button>Submit</Button>
                                </form>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </Authenticated>
    )
}
