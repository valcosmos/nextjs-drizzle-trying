'use client'

import AddMessage, { FormProps } from '@/components/feature/AddMessage'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { MessageProps, queryMessageSchema } from '@/server/db/validate-schema'
import { trpcClientReact } from '@/utils/api'
import { PlusIcon, Pencil1Icon, TrashIcon } from '@radix-ui/react-icons'
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'
import { useEffect, useState } from 'react'
import z from 'zod'

export default function Home() {
  const { mutateAsync } = trpcClientReact.deleteMessage.useMutation()
  const [resetForm, setResetForm] = useState<FormProps>()
    const [data, setData] = useState<MessageProps[]>([])
    const [open, setOpen] = useState<boolean>(false)
    const { data: messages, refetch } = trpcClientReact.getMessages.useQuery()
  const columns: ColumnDef<MessageProps>[] = [
    {
      accessorKey: 'id',
      header: 'ID',
      cell: ({ row }) => <div className="capitalize">{row.getValue('id')}</div>
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => <div className="lowercase">{row.getValue('email')}</div>
    },
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => <div className="lowercase">{row.getValue('name')}</div>
    },
    {
      accessorKey: 'message',
      header: 'Message',
      cell: ({ row }) => <div className="lowercase">{row.getValue('message')}</div>
    },
    {
      accessorKey: 'createdAt',
      header: 'Created At',
      cell: ({ row }) => <div className="lowercase">{row.getValue('createdAt')}</div>
    },
    {
      accessorKey: 'updatedAt',
      header: 'Updated At',
      cell: ({ row }) => <div className="lowercase">{row.getValue('updatedAt')}</div>
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        console.log(row)
        return (
          <div className="flex gap-1">
            <Button
              onClick={() => {
                setResetForm({
                  id: row.original.id,
                  name: row.original.name!,
                  email: row.original.email,
                  message: row.original.message
                })
                setOpen(true)
              }}
            >
              <Pencil1Icon />
            </Button>
            <Button
              onClick={async () => {
                await mutateAsync(row.original.id)
                refetch()
              }}
            >
              <TrashIcon />
            </Button>
          </div>
        )
      }
    }
  ]


  useEffect(() => {
    if (messages?.length) {
      setData(messages)
    }
  }, [messages])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel()
  })

  return (
    <div className="container max-w-3xl mx-auto space-y-4 mt-12">
      <header className="flex justify-between items-center">
        <h2 className="text-3xl">Messages</h2>
        <Button onClick={() => setOpen(true)}>
          <PlusIcon />
        </Button>
      </header>

      <main>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <AddMessage
          open={open}
          onSuccess={() => {
            setOpen(false)
            refetch()
          }}
          resetFromData={resetForm}
        />
      </main>
    </div>
  )
}
