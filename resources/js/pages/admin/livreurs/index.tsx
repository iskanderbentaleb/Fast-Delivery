import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { type ColumnDef } from '@tanstack/react-table';
import { DataTable } from '../livreurs/components/data-table';
import { Button } from "@/components/ui/button";
import { Trash, Edit, MapPinned, DollarSign } from "lucide-react";
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

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { CommunePrices } from '../livreurs/CommunePrices';

interface Commune {
  id: number;
  commune_name: string;
  wilaya_id: number;
}

interface CommunePrice {
  commune_id: number;
  delivery_price: number;
  return_price: number;
}

interface Wilaya {
  id: string;
  wilaya_name: string;
}

type Livreur = {
  id: number;
  name: string;
  phone: string;
  email: string;
  wilaya: Wilaya;
  commune_prices: CommunePrice[];
};

interface LivreursProps {
  livreurs: {
    data: Livreur[];
    links: { url: string | null; label: string; active: boolean }[];
  };
  communes: Commune[];
}

export default function Livreurs({ livreurs, communes }: LivreursProps) {
  const columns: ColumnDef<Livreur>[] = [
    { accessorKey: 'name', header: 'Nom' },
    { accessorKey: 'phone', header: 'Téléphone' },
    { accessorKey: 'email', header: 'E-mail' },
    { accessorKey: 'wilaya.wilaya_name', header: 'Zone' },
    {
    accessorKey: 'actions',
    header: () => <div className="text-center w-full">Actions</div>,
    cell: ({ row }) => {
        const livreur = row.original;

        const handleDelete = () => {
        router.delete(route("admin.livreurs.destroy", { id: livreur.id }), {
            onSuccess: () => toast.success("Livreur supprimé avec succès !"),
            onError: () => toast.error("Une erreur s'est produite."),
        });
        };

        const handleEdit = () => {
        router.get(route("admin.livreurs.edit", { id: livreur.id }));
        };

        const filteredCommunes = communes.filter(
        (c) => c.wilaya_id === Number(livreur.wilaya.id)
        );

        return (
        <div className="flex justify-center items-center space-x-2">
            {/* Commune Prices Popover */}
            <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center">
                <MapPinned className="h-4 w-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[700px] max-h-[400px] overflow-auto">
                <CommunePrices
                livreurId={livreur.id}
                communes={filteredCommunes}
                communePrices={livreur.commune_prices}
                />
            </PopoverContent>
            </Popover>

            {/* Financial Summary Popover */}
            <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center">
                <DollarSign className="h-4 w-4" />
                {/* <span className="ml-1">Bilan</span> */}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-4 text-sm">
                <div className="space-y-2">
                <div className="flex justify-between">
                    <span>Total ramassé</span>
                    <span className="font-medium text-foreground">
                    {livreur.total_collected ?? '—'}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span>Total débets</span>
                    <span className="font-medium text-foreground">
                    {livreur.total_debts ?? '—'}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span>Profit total</span>
                    <span className="font-medium text-foreground">
                    {livreur.total_profit ?? '—'}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span>Profit à recevoir</span>
                    <span className="font-medium text-green-600 dark:text-green-400">
                    {livreur.profit_due ?? '—'}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span>Montant restant à payer</span>
                    <span className="font-medium text-red-600 dark:text-red-400">
                    {livreur.remaining_payment ?? '—'}
                    </span>
                </div>
                </div>
            </PopoverContent>
            </Popover>

            {/* Edit Button */}
            <Button
            variant="outline"
            size="sm"
            className="flex items-center"
            onClick={handleEdit}
            >
            <Edit className="h-4 w-4" />
            </Button>

            {/* Delete Dialog */}
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
                    Êtes-vous sûr de vouloir supprimer ce livreur ?
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
      <Head title="Liste des livreurs" />
      <div className="p-4">
        <DataTable columns={columns} data={livreurs.data} paginationLinks={livreurs.links || []} />
      </div>
    </AppLayout>
  );
}
