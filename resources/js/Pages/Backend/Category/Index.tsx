import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import Authenticated from '@/Layouts/AuthenticatedLayout'
import { Head, Link } from '@inertiajs/react'
import React from 'react'

export default function Index() {
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
                        <p>Table komponen</p>
                    </CardContent>
                </Card>
            </div>
        </Authenticated>
    )
}
