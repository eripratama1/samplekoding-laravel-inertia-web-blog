import React from 'react'
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { PaginationData } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Button } from './ui/button';
import { router } from '@inertiajs/react';

interface DataTableProps<T> {
    data: T[];
    columns: ColumnDef<T>[];
    paginationData?: PaginationData<T>;
    actionButton?: React.ReactNode;
    actionInputSearch?: React.ReactNode;
}

function DataTable<T>({ data, columns, paginationData, actionButton, actionInputSearch }: DataTableProps<T>) {

    const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() })

    return (
        <div className='w-full'>
            <div className='flex items-center py-4'>
                {actionInputSearch}
            </div>
            <div className='ml-auto my-2'>{actionButton}</div>

            <div className='rounded-md border'>
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow
                                key={headerGroup.id}
                            >
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder ? null :
                                                flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext(),
                                                )
                                            }
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>

                    <TableBody>
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className='h-24 text-center'
                                >
                                    Data Empty
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className='flex items-center justify-end space-x-2 py-4'>
                {paginationData && (
                    <div className='flex text-sm text-muted-foreground'>
                        {paginationData.total > 0 ? (
                            <React.Fragment>
                                Showing{" "}
                                {paginationData.per_page * (paginationData.current_page - 1) + 1}{" "}
                                to{" "}
                                {Math.min(
                                    paginationData.per_page * paginationData.current_page,
                                    paginationData.total,
                                )}{""}
                                of {paginationData.total} entries
                            </React.Fragment>
                        ) : (
                            "No Entries found"
                        )}
                    </div>
                )}

                <div className='space-x-2 my-2'>
                    <Button
                        variant={"outline"}
                        size={"sm"}
                        onClick={() => {
                            if (paginationData?.prev_page_url) {
                                router.get(paginationData.prev_page_url)
                            }
                        }}
                        disabled={!paginationData?.prev_page_url}
                    >
                        Previous
                    </Button>

                    <Button
                        variant={"outline"}
                        size={"sm"}
                        onClick={() => {
                            if (paginationData?.next_page_url) {
                                router.get(paginationData.next_page_url)
                            }
                        }}
                        disabled={!paginationData?.next_page_url}
                    >
                        Next
                    </Button>
                </div>
            </div>


        </div>
    )
}

export default DataTable
