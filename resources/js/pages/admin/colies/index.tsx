// resources/js/Pages/admin/colies/index.tsx

import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { type ColumnDef } from '@tanstack/react-table';
import { Button } from "@/components/ui/button";
import { Trash, Edit } from "lucide-react";
import { toast } from 'sonner';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { DataTable } from './components/data-table';

type Colie = {
  id: string;
  tracking: string;
  client_fullname: string;
  client_phone: string;
  client_amount: string;
  livreur_amount: string;
  has_exchange: boolean;
  id_status: string;
};

interface ColiesProps {
  colies: {
    data: Colie[];
    links: { url: string | null; label: string; active: boolean }[];
  };
}

export default function Colies({ colies }: ColiesProps) {
  const columns: ColumnDef<Colie>[] = [

    { accessorKey: 'tracking', header: 'Tracking' },
    { accessorKey: 'client_fullname', header: 'Client' },
    { accessorKey: 'client_phone', header: 'Téléphone' },
    { accessorKey: 'status', header: 'Statut' },
    { accessorKey: 'wilaya', header: 'wilaya' },
    { accessorKey: 'commune', header: 'commune' },
    {
      accessorKey: 'actions',
      header: () => <div className="text-center w-full">Actions</div>,
      cell: ({ row }) => {
        const colie = row.original;

        const handleDelete = () => {
          router.delete(route("admin.colies.destroy", { id: colie.id }), {
            onSuccess: () => toast.success("Colie supprimé avec succès !"),
            onError: () => toast.error("Une erreur s'est produite."),
          });
        };

        const handleEdit = () => {
          router.get(route("admin.colies.edit", { id: colie.id }));
        };

        return (
          <div className="flex justify-center items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center"
              onClick={handleEdit}
            >
              <Edit className="h-4 w-4" />
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" className="flex items-center">
                  <Trash className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-white dark:bg-zinc-950">
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                  <AlertDialogDescription>
                    Êtes-vous sûr de vouloir supprimer ce colie ?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>Supprimer</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        );
      },
    },
  ];

  return (
    <AppLayout>
      <Head title="Liste des Colies" />
      <div className="p-4">
        <DataTable columns={columns} data={colies.data} paginationLinks={colies.links || []} />
      </div>
    </AppLayout>
  );
}
