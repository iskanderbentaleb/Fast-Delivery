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
import { Search, UserRoundPlus } from 'lucide-react';

import { useState } from "react";
import { router, usePage } from "@inertiajs/react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  paginationLinks: { url: string | null; label: string; active: boolean }[];
}

export function DataTable<TData, TValue>({ columns, data, paginationLinks }: DataTableProps<TData, TValue>) {

    const { search } = usePage().props;
    const [query, setQuery] = useState<string>(typeof search === 'string' ? search : "");

    const handleSearch = () => {
        router.get(route("admin.livreurs"), { search: query }, { preserveScroll: true, preserveState: true });
    };

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
    <>
        {/* Header */}
        <div className="flex flex-row flex-wrap items-center justify-between gap-4 p-4 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Liste des livreurs</h1>
            <Button
                onClick={() => router.get(route("admin.livreurs.create"))}
                className="bg-zinc-950 text-white hover:bg-zinc-700 dark:hover:bg-zinc-900 whitespace-nowrap"
                >
                Créer un livreur
                <UserRoundPlus />
            </Button>
        </div>


        {/* ---- Table ------ */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-gray-700 p-2 rounded-lg shadow-sm mt-6">

            {/* ---- Search ------ */}
            <form
            onSubmit={(e) => {
                e.preventDefault(); // Prevent full page reload
                handleSearch();
            }}
            className="flex flex-row flex-wrap items-center justify-between gap-4 p-3 border border-b-gray-300 dark:border-b-gray-700 bg-white dark:bg-zinc-950"
            >
                <Input
                    placeholder="Chercher ici..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full sm:w-auto flex-1 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-transparent"
                />
                <Button type="submit" className="bg-zinc-900 text-white hover:bg-zinc-700 dark:hover:bg-zinc-800 whitespace-nowrap">
                    <Search />
                </Button>
            </form>


            <Table className="w-full">
                {/* Table Header */}
                <TableHeader className="bg-gray-100 dark:bg-neutral-950">
                {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow
                    key={headerGroup.id}
                    className="border-1 border-gray-300 dark:border-gray-700 hover:bg-transparent"
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
                        Aucun résultat trouvé.
                    </TableCell>
                    </TableRow>
                )}
                </TableBody>
            </Table>
        </div>


            {/* ---- Pagination & Selected Rows ------ */}
            <div className="mt-2 flex items-center justify-between space-x-1 py-2 bg-white dark:bg-zinc-900 rounded-md shadow-sm">
                {/* Left Side: Selected Rows Info */}
                <div className="ml-2">
                    <DataTablePagination paginationLinks={paginationLinks} />
                </div>
            </div>
    </>
  )
}
