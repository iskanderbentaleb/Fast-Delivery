"use client"
import * as React from "react"
import {
  ColumnDef,
  flexRender,
  SortingState,
  ColumnFiltersState,
  getFilteredRowModel,
  getPaginationRowModel,
  getCoreRowModel,
  getSortedRowModel,
  VisibilityState,
  useReactTable,
} from "@tanstack/react-table"

import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DataTablePagination } from "./Pagination"
import { Button } from "@/components/ui/button"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  paginationLinks: { url: string | null; label: string; active: boolean }[];
}

export function DataTable<TData, TValue>({ columns, data, paginationLinks }: DataTableProps<TData, TValue>) {

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="space-y-4">
    {/* ---- Search & Controls ------ */}
        <div className="flex flex-row flex-wrap items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-2 rounded-lg border border-gray-300 dark:border-gray-700 shadow-sm">
            <Button className="bg-zinc-950 text-white hover:bg-zinc-950 whitespace-nowrap">Add New</Button>
        </div>


    {/* ---- Table ------ */}
    <div className="overflow-hidden border border-gray-300 dark:border-gray-700 shadow-sm bg-white dark:bg-zinc-900 rounded-lg">

        <div className="flex flex-row flex-wrap items-center justify-between gap-4 p-4 border border-b-gray-300 dark:border-b-gray-700 shadow-sm">
            <Input
            placeholder="Search..."
            value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
            onChange={(event) => table.getColumn("email")?.setFilterValue(event.target.value)}
            className="w-full sm:w-auto flex-1 border border-gray-300 dark:border-gray-700"
            />
            {/* <Button className="bg-zinc-950 text-white hover:bg-zinc-950 whitespace-nowrap">Add New</Button> */}
        </div>


        <Table className="w-full">
            {/* Table Header */}
            <TableHeader className="bg-gray-200 dark:bg-neutral-900">
            {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                key={headerGroup.id}
                className="border-b border-gray-300 dark:border-gray-700 hover:bg-transparent"
                >
                {headerGroup.headers.map((header) => (
                    <TableHead
                    key={header.id}
                    className="p-3 text-sm font-bold text-gray-900 dark:text-gray-100 uppercase"
                    >
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                ))}
                </TableRow>
            ))}
            </TableHeader>


            {/* Table Body */}
            <TableBody>
            {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                >
                    {row.getVisibleCells().map((cell) => (
                    <TableCell
                        key={cell.id}
                        className="p-4 border border-gray-300 dark:border-gray-700 text-sm text-gray-900 dark:text-gray-200"
                    >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                    ))}
                </TableRow>
                ))
            ) : (
                <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-gray-500">
                    No results found.
                </TableCell>
                </TableRow>
            )}
            </TableBody>
        </Table>
    </div>


      {/* ---- Pagination & Selected Rows ------ */}
      <div className="flex items-center justify-between space-x-2 py-4 bg-white dark:bg-zinc-900 rounded-lg">
            {/* Left Side: Selected Rows Info */}
            <div className="flex ml-4">
                <DataTablePagination paginationLinks={paginationLinks} />
            </div>

            {/* Right Side: Pagination Controls */}
            <div className="text-sm text-muted-foreground mr-4">
                {table.getFilteredSelectedRowModel().rows.length} of{" "}
                {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
        </div>

    </div>
  )
}
