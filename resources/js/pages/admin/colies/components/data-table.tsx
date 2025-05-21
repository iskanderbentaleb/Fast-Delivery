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
import { ChevronDown, FileDown, History, PackagePlus, Printer } from 'lucide-react'
import { router, usePage } from "@inertiajs/react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { FilterPopover } from "./filter"
import { useFilters } from "@/contexts/FilterContext"
import { toast } from "sonner"
import { useStatusSheet } from "../status/StatusSheet"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[],
    colies_count?: number;
    statuses?: {
        id: string;
        status: string;
        backgroundColorHex: string;
        TextColorHex: string;
    }[];
    selectedFilters: string[];
    paginationLinks: { url: string | null; label: string; active: boolean }[];
}

export function DataTable<TData, TValue>({ columns, data, selectedIds , colies_count, statuses, selectedFilters, paginationLinks }: DataTableProps<TData, TValue>) {
  const { searchFilter } = usePage().props

  const { searchValue, setSearchValue } = useFilters();
  const { open, openSheet, SheetComponent } = useStatusSheet()


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
        <div className="flex items-center justify-between flex-wrap gap-2">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                Liste des colies
            </h1>
            <span className="text-sm font-medium px-2.5 py-1.5 rounded bg-zinc-200 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100">
                {colies_count}
            </span>
        </div>

        <Popover>
            <PopoverTrigger asChild>
                <Button
                variant="default"
                className="bg-zinc-950 text-white hover:bg-zinc-800 dark:hover:bg-zinc-900 flex items-center gap-2 px-4 py-2"
                >
                Actions <ChevronDown className="w-4 h-4" />
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-52 p-2 space-y-1 dark:bg-zinc-950 shadow-xl border border-zinc-200 dark:border-zinc-800 rounded-xl">
                {[
                {
                    icon: PackagePlus,
                    label: "Ajouter",
                    onClick: () => router.get(route("admin.colies.create")),
                },
                {
                    icon: Printer,
                    label: "Imprimer",
                    onClick: () => {
                      if (selectedIds.length === 0) {
                        toast.success({
                          title: "Aucun colis sélectionné",
                          description: "Veuillez sélectionner au moins un colis pour générer le bordereau.",
                          variant: "destructive",
                        });
                        return;
                      }else{
                        const params = new URLSearchParams({
                            search: searchValue ?? '',
                          });

                          selectedIds.forEach(id => params.append('selectedIds[]', id));
                          selectedFilters.forEach(status => params.append('statuses[]', status));

                          const url = route('admin.colies.bordereaux') + '?' + params.toString();
                          window.open(url, '_blank');
                      }
                    }
                },
                {
                    icon: History,
                    label: "Changer le statut",
                    onClick: openSheet,
                },
                {
                    icon: FileDown,
                    label: "Exporter",
                    onClick: () => {
                      if (selectedIds.length === 0) {
                        toast({
                          title: "Aucun colis sélectionné",
                          description: "Veuillez sélectionner au moins un colis pour générer le bordereau.",
                          variant: "destructive",
                        });
                        return;
                      }else{
                        const params = new URLSearchParams({
                            search: searchValue ?? '',
                          });

                          selectedIds.forEach(id => params.append('selectedIds[]', id));
                          selectedFilters.forEach(status => params.append('statuses[]', status));

                          const url = route('admin.colies.export') + '?' + params.toString();
                          window.open(url, '_blank');
                      }
                    }
                },
                ].map(({ icon: Icon, label, onClick }, i) => (
                <Button
                    key={i}
                    variant="ghost"
                    className="w-full justify-start gap-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    onClick={onClick}
                >
                    <Icon className="w-4 h-4" />
                    {label}
                </Button>
                ))}
            </PopoverContent>
        </Popover>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-gray-700 p-2 rounded-lg shadow-sm mt-6">
        {/* Search and Filter - Now handled entirely by FilterPopover */}
        <FilterPopover
          statuses={statuses}
          selectedFilters={selectedFilters}
          currentSearch={typeof searchFilter === 'string' ? searchFilter : ""}
        />

        <Table className="w-full">
          <TableHeader className="bg-gray-100 dark:bg-neutral-950">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-1 border-gray-300 dark:border-gray-700 hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="p-3 text-sm font-bold text-gray-900 dark:text-gray-100 uppercase">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="p-4 border border-gray-300 dark:border-gray-700 text-sm text-gray-900 dark:text-gray-200">
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

      {/* Pagination */}
      <div className="mt-2 flex items-center justify-between space-x-1 py-2 bg-white dark:bg-zinc-900 rounded-md shadow-sm">
        <div className="ml-2">
          <DataTablePagination paginationLinks={paginationLinks} />
        </div>
      </div>



    {/* status change */}
    <SheetComponent />
    </>
  )
}
