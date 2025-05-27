import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { type ColumnDef } from '@tanstack/react-table';
import { Button } from "@/components/ui/button";
import { Trash, DollarSign, Printer, FileDown } from "lucide-react";
import { toast } from 'sonner';
import dayjs from 'dayjs';
import {AlertDialog,AlertDialogAction,AlertDialogCancel,AlertDialogContent,AlertDialogDescription,AlertDialogFooter,AlertDialogHeader,AlertDialogTitle,AlertDialogTrigger,} from "@/components/ui/alert-dialog";
import {Popover,PopoverContent,PopoverTrigger} from "@/components/ui/popover";
import { DataTable } from './components/data-table';

interface Wilaya {
  id: number;
  wilaya_name: string;
}

interface Livreur {
  id: number;
  name: string;
  wilaya: Wilaya;
}

interface Creator {
  id: number;
  name: string;
}

type Payment = {
  id: string;
  total_store_payment: number;
  total_return_fee_payment: number;
  total_client_payment:number;
  total_courier_delivered_payment: number;
  total_courier_net_payment: number;
  created_at:string;
  created_by_id: string;
  livreur: Livreur;
  creator: Creator;
};

interface PaymentsProps {
  payments: {
    data: Payment[];
    links: { url: string | null; label: string; active: boolean }[];
  };
}

export default function Payments({ payments }: PaymentsProps) {
  const columns: ColumnDef<Payment>[] = [
    {
      accessorKey: 'created_at',
      header: () => "Date de paiement",
      cell: ({ row }) => {
        const date = row.original.created_at;
        return dayjs(date).format("D MMMM YYYY [à] HH:mm:ss");
    }
    },
    {
      accessorKey: 'creator.name',
      header: 'Créé par',
    },
    {
      accessorKey: 'livreur.name',
      header: 'Livreur',
    },
    {
      accessorKey: 'actions',
      header: () => <div className="text-center w-full">Actions</div>,
      cell: ({ row }) => {
        const payment = row.original;

        const handleDelete = () => {
          router.delete(route("admin.payments.destroy", { id: payment.id }), {
            onSuccess: () => toast.success("Paiement supprimé avec succès !"),
            onError: () => toast.error("Une erreur s'est produite."),
          });
        };

        const handlePrint = () => {
          window.open(route("admin.payments.paymentPrint", { payment_id: payment.id }), '_blank');
        };

        const handleExport = () => {
            window.open(route("admin.payments.export", { payment_id: payment.id }), '_blank');
            toast.success("Export started!");
        };



        return (
          <div className="flex justify-center items-center space-x-2">
            {/* Payment Summary Popover */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center">
                  <DollarSign className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
                <PopoverContent className="w-[500px] bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-4 text-sm">
                    <div className="space-y-2 divide-y divide-gray-200 dark:divide-zinc-700">
                        <div className="flex justify-between py-2">
                            <span>Montant Clients (DZD)</span>
                            <span className="font-medium">{payment.total_client_payment} DA</span>
                        </div>
                        <div className="flex justify-between py-2">
                            <span>Frais de retour (DZD)</span>
                            <span className="font-medium">{payment.total_return_fee_payment} DA</span>
                        </div>
                        <div className="flex justify-between py-2">
                            <span>Montant livraisons réussies (DZD)</span>
                            <span className="font-medium">{payment.total_courier_delivered_payment} DA</span>
                        </div>
                        <div className="flex justify-between py-2">
                            <span>Règlement net livreur (DZD)</span>
                            <span className="font-medium">{payment.total_courier_net_payment} DA</span>
                        </div>
                        <div className="flex justify-between py-2">
                            <span>Montant dû au magasin (DZD)</span>
                            <span className="font-medium">{payment.total_store_payment} DA</span>
                        </div>
                    </div>
                </PopoverContent>

            </Popover>

            {/* print button */}
            <Button
              variant="outline"
              size="sm"
              className="flex items-center"
              onClick={handlePrint}
            >
              <Printer className="h-4 w-4" />
            </Button>

            {/* export button */}
            <Button
              variant="outline"
              size="sm"
              className="flex items-center"
              onClick={handleExport}
            >
              <FileDown className="h-4 w-4" />
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
                    Êtes-vous sûr de vouloir supprimer ce paiement ?
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
      <Head title="Liste des paiements" />
      <div className="p-4">
        <DataTable columns={columns} data={payments.data} paginationLinks={payments.links || []} />
      </div>
    </AppLayout>
  );
}
