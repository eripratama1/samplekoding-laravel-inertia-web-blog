import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import Authenticated from '@/Layouts/AuthenticatedLayout'
import { Category } from '@/types'
import { Head, Link } from '@inertiajs/react'
import React from 'react'

interface CategoryIndexProps {
    category: Category[]
}

export default function Index({ category }: CategoryIndexProps) {

    console.log('result props category', category);

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
                        <Table>

                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nama Kategori</TableHead>
                                    <TableHead>Options</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {category.map((category) => (
                                    <TableRow key={category.id}>
                                        <TableCell className="font-medium">{category.title}</TableCell>
                                        <TableCell className='flex gap-1'>
                                            <Button size={"sm"}>Edit</Button>
                                            <Button size={"sm"} variant={"destructive"}>Delete</Button>
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
