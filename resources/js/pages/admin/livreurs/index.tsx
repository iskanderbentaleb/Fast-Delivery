import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { type ColumnDef } from '@tanstack/react-table';
import { DataTable } from './components/data-table';

import { Button } from "@/components/ui/button";
import { Link } from "@inertiajs/react";
import { Trash, Edit } from "lucide-react";
import { DataTablePagination } from './components/Pagination';

type Livreur = {
    id: number;
    name: string;
    phone: string;
    email: string;
    wilaya: { id: string; wilaya_name: string };
};

interface LivreursProps {
    livreurs: {
        data: Livreur[];
        links: { url: string | null; label: string; active: boolean }[];
    };
}


const columns: ColumnDef<Livreur>[] = [
    { accessorKey: 'name', header: 'Nom' },
    { accessorKey: 'phone', header: 'Telphone' },
    { accessorKey: 'email', header: 'E-mail' },
    { accessorKey: 'wilaya.wilaya_name', header: 'Wilaya' },
    {
        accessorKey: 'actions',
        header: () => <div className="text-center w-full">Actions</div>, // Center header text
        cell: ({ row }) => {
            const livreur = row.original;

            return (
                <div className="flex justify-center items-center space-x-2">
                    {/* Edit Button */}
                    <Button variant="outline" size="sm" className="flex items-center">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                    </Button>

                    {/* Delete Button */}
                    <Button variant="destructive" size="sm" className="flex items-center">
                        <Trash className="h-4 w-4 mr-1" />
                        Delete
                    </Button>
                </div>
            );
        },
    },
];

export default function Livreurs({ livreurs }: LivreursProps) {
    return (
        <AppLayout>
            <Head title="Livreurs" />
            <div className="p-4">
                <DataTable columns={columns} data={livreurs.data} paginationLinks={livreurs.links} />
            </div>
        </AppLayout>
    );
}
