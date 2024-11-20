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

    // Inisialisasi form menggunakan useForm dengan nilai awal untuk tiap field denganstring kosong atau null,

    const { data, setData, post, processing, errors } = useForm({
        title: '',               // Input untuk judul artikel
        category_id: '',         // Input untuk kategori artikel
        content: '',             // Input untuk isi artikel
        image: null as File | null, // Input untuk file gambar (bisa null)
        user_id: auth.user.id    // ID user yang membuat artikel
    });

    // Fungsi untuk menangani perubahan input file gambar
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        /**
         * Ambil file yang diunggah dari event
         * Periksa apakah file ada
         * Set file ke dalam state `data.image`
         */
        const files = e.target.files;
        if (files && files[0]) {
            setData('image', files[0]);
        }
    }

    // Fungsi untuk menangani submit form
    const submitData: FormEventHandler = (e) => {
        e.preventDefault()

        /**
         * Buat instance FormData untuk mengirim data termasuk file
         */
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("content", data.content);
        formData.append("category)id", data.category_id);

        /**
         * Jika ada file gambar, tambahkan ke FormData
         */
        if (data.image) {
            formData.append("image", data.image);
        }

        /**
         * Kirim data ke server menggunakan fungsi post
           Fungsi ini akan memanggil endpoint `article.store` di server
         */

        post(route('article.store'), {
            onSuccess: () => {
                toast.success("Article Stored");
            },
            onError: () => {
                toast.error("Failed to store article");
            }
        })
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
                                            <Select
                                                onValueChange={(value) => {
                                                 /**
                                                 * Cari kategori berdasarkan nilai yang dipilih
                                                 * Jika kategori ditemukan, set ID kategori di data form
                                                 */
                                                    const selectedCategory = category.find((category) => category.title === value)
                                                    if (selectedCategory) {
                                                        setData("category_id", selectedCategory.id.toString())
                                                    }
                                                }}
                                            >
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
                                            <InputError message={errors.category_id} />
                                        </div>

                                        <div className='grid gap-2'>
                                            <Label>Upload Image</Label>
                                            <Input
                                                name='image'
                                                type='file'
                                                onChange={handleImageChange}
                                                className='w-full my-3'
                                                disabled={processing}
                                            />
                                            <InputError message={errors.image} />
                                        </div>
                                    </div>

                                    <div className='relative z-10'>
                                        <Label>Content Article</Label>
                                        <CKEditor
                                            editor={ClassicEditor}

                                            onChange={(event, editor) => {
                                            /**
                                             * Ambil konten yang dimasukkan oleh user dari editor
                                             * Simpan konten ke dalam state form menggunakan setData
                                            */
                                                const content = editor.getData();
                                                setData("content", content);
                                            }}
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
                                                    Bold, Essentials, Italic, Alignment, CodeBlock, Paragraph,
                                                    Image, ImageUpload, ImageToolbar, SimpleUploadAdapter,
                                                    ImageResize, ImageResizeButtons
                                                ]
                                            }}
                                        />
                                    </div>
                                    <InputError message={errors.content} />

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