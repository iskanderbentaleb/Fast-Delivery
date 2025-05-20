import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { Table, type ColumnDef, type Row } from '@tanstack/react-table';
import { Button } from "@/components/ui/button";
import { Trash, Edit, Copy, Clock, Check, RefreshCw, ArrowRightLeft, X, Eye, CalendarDays, Package, Printer } from "lucide-react";
import { toast } from 'sonner';
import { Badge } from "@/components/ui/badge";
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { statusIcons } from './components/statusIcons';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';

type Colie = {
  id: string;
  tracking: string;
  client_fullname: string;
  client_phone: string;
  client_amount: string;
  livreur_amount: string;
  has_exchange: boolean;
  id_exchange_return ?: string;
  id_status: string;
  client_address : string;
  external_id: string;
  products: string;
  product_value: number;
  return_fee: number;
  livreur: {
    id: string;
    name: string;
  };
  status: {
    status: string;
    backgroundColorHex: string;
    TextColorHex: string;
  };
  wilaya: {
    wilaya_name: string;
  };
  commune: {
    commune_name: string;
  };
  status_history?: Array<{
    status: string;
    date: string;
  }>;
  created_at: string;
  updated_at: string;
};

interface ColiesProps {
  colies: {
    data: Colie[];
    links: { url: string | null; label: string; active: boolean }[];
  };
  colies_count: number;
  selectedFilters: string[];
  statuses: {
        id: string;
        status: string;
        backgroundColorHex: string;
        TextColorHex: string;
  }[];
  stats?: {
    total: number;
    delivered: number;
    pending: number;
    returned: number;
  };
}





export default function Colies({ colies , statuses  , selectedFilters ,  colies_count }: ColiesProps) {


const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
const [selectionModalOpen, setSelectionModalOpen] = useState(false);

  const columns: ColumnDef<Colie>[] = [
    {
        id: "select",
        header: ({ table }: { table: Table<Colie> }) => {
          const currentPageIds = table.getCoreRowModel().rows.map((row: { original: Colie }) => row.original.id);
          const allSelectedOnPage = currentPageIds.every((id: string) => selectedIds.has(id));
          const someSelectedOnPage = currentPageIds.some((id: string) => selectedIds.has(id)) && !allSelectedOnPage;
          const allItemsSelected = selectedIds.has('ALL'); // Check if "ALL" is selected

          return (
            <div className="flex justify-center items-center mr-4">
              <Popover>
                <PopoverTrigger>
                  <div className="cursor-pointer">
                    <Checkbox
                      checked={allSelectedOnPage || allItemsSelected}
                      ref={(el) => {
                        if (el) {
                          if (el instanceof HTMLInputElement) {
                            el.indeterminate = someSelectedOnPage;
                          }
                        }
                      }}
                      aria-label="Select all"
                    />
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-3 bg-white dark:bg-zinc-900">
                  <div className="space-y-3">
                    <p className="text-sm font-medium">
                      Sélection multiple
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {selectedIds.size} sélectionnés sur {colies_count} au total
                    </p>

                    <div className="flex flex-col gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="justify-start"
                        onClick={() => {
                          const newSelected = new Set(selectedIds);
                          currentPageIds.forEach(id => newSelected.add(id));
                          setSelectedIds(newSelected);
                        }}
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Sélectionner cette page ({currentPageIds.length})
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        className="justify-start"
                        onClick={() => {
                          const newSelected = new Set(selectedIds);
                          currentPageIds.forEach(id => newSelected.delete(id));
                          setSelectedIds(newSelected);
                        }}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Désélectionner cette page
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        className="justify-start"
                        onClick={() => setSelectionModalOpen(true)}
                      >
                        <Check className="h-4 w-4 mr-2" />
                        {allItemsSelected ?
                          "Désélectionner tout" :
                          `Sélectionner tout (${colies_count})`
                        }
                      </Button>

                      {selectedIds.size > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="justify-start text-destructive hover:text-destructive"
                          onClick={() => setSelectedIds(new Set())}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Effacer toute la sélection
                        </Button>
                      )}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Selection Modal */}
              <AlertDialog open={selectionModalOpen} onOpenChange={setSelectionModalOpen}>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Sélectionner tous les colis ?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Voulez-vous sélectionner uniquement les colis visibles sur cette page ou tous les colis ?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <Button
                      variant="outline"
                      onClick={() => {
                        // Select current page only
                        const newSelected = new Set(selectedIds);
                        currentPageIds.forEach(id => newSelected.add(id));
                        setSelectedIds(newSelected);
                        setSelectionModalOpen(false);
                      }}
                    >
                      Cette page seulement ({currentPageIds.length})
                    </Button>
                    <AlertDialogAction
                    onClick={() => {
                        // Always use the 'ALL' marker for large datasets
                        setSelectedIds(new Set(['ALL']));
                        toast(`Tous les ${colies_count} colis sont sélectionnés`);
                        setSelectionModalOpen(false);
                      }}
                    >
                    Tous les colis ({colies_count})
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          );
        },
        cell: ({ row }: { row: Row<Colie> }) => {
          const isSelected = selectedIds.has(row.original.id) || selectedIds.has('ALL');

          return (
            <div className="flex justify-center items-center mr-4">
              <Checkbox
                checked={isSelected}
                onCheckedChange={(checked) => {
                  const newSelected = new Set(selectedIds);
                  if (checked) {
                    newSelected.add(row.original.id);
                    // If "ALL" was selected before, remove it when manually selecting individual items
                    newSelected.delete('ALL');
                  } else {
                    newSelected.delete(row.original.id);
                  }
                  setSelectedIds(newSelected);
                }}
                aria-label="Select row"
              />
            </div>
          );
        },
        size: 40,
    },
    {
        accessorKey: "tracking",
        header: "Tracking",
        cell: ({ row }) => {
          const tracking = row.getValue("tracking") as string;
          const isExchange = row.original.id_exchange_return !== null;
          const hasExchange = row.original.has_exchange;
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const [isCopied, setIsCopied] = useState(false);

          const handleCopy = () => {
            navigator.clipboard.writeText(tracking);
            setIsCopied(true);
            toast("Tracking copié dans le presse-papier", {
              icon: "📋",
              duration: 2000,
            });

            // Reset copied state after 2 seconds
            setTimeout(() => setIsCopied(false), 2000);
          };

          return (
            <div className="flex items-center gap-2 min-w-[220px]">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-accent/50"
                      onClick={handleCopy}
                      aria-label="Copier le tracking"
                    >
                      {isCopied ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p>{isCopied ? "Copié !" : "Copier le tracking"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <Badge
                variant={isExchange ? "secondary" : "default"}
                className={cn(
                  "font-mono flex items-center gap-2 py-2 px-3",
                  "transition-all hover:shadow-sm",
                  "border border-transparent hover:border-border",
                  "max-w-full overflow-hidden"
                )}
              >
                <span className="truncate max-w-[120px] sm:max-w-[180px]">
                  {tracking}
                </span>

                {hasExchange && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="inline-flex items-center gap-1 bg-white dark:bg-zinc-900/80 text-zinc-800 dark:text-zinc-200 px-2 py-0.5 rounded-full text-xs whitespace-nowrap">
                          <RefreshCw className="h-3 w-3" />
                          <span>Avec échange</span>
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Ce colis a un échange associé</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}

                {isExchange && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="inline-flex items-center gap-1 bg-zinc-500 dark:bg-zinc-900/80 text-white dark:text-purple-200 px-2 py-0.5 rounded-full text-xs whitespace-nowrap">
                          <ArrowRightLeft className="h-3 w-3" />
                          <span>Échange</span>
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Ce colis est un échange</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </Badge>
            </div>
          );
        },
    },
    {
      accessorKey: "client_fullname",
      header: "Client",
      cell: ({ row }) => {
        const client = row.getValue("client_fullname") as string;
        const phone = row.original.client_phone;

        return (
          <div className="space-y-1">
            <p className="font-medium">{client}</p>
            <p className="text-sm text-muted-foreground">{phone}</p>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Statut",
      cell: ({ row }) => {
        const status = row.original.status;
        const history = row.original.status_history || [];

        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                className="h-auto p-0 hover:bg-transparent hover:underline"
              >
                <Badge
                variant="outline"
                className="flex items-center space-x-1 border-none px-1.5 py-0.5"
                style={{
                    padding: "0.6rem 1rem",
                    backgroundColor: status.backgroundColorHex,
                    color: status.TextColorHex,
                }}
                >
                    {statusIcons[status.status] || <Clock className="h-3.5 w-3.5" />}
                    <span className="text-xs">{status.status}</span>
                </Badge>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-2">
              <div className="text-sm font-medium mb-2">Historique du statut</div>
              <ul className="space-y-2 max-h-60 overflow-auto">
                {history.length > 0 ? (
                  history.map((s, i) => (
                    <li key={i} className="flex justify-between text-sm">
                      <span>{s.status}</span>
                      <span className="text-muted-foreground text-xs">
                        {new Date(s.date).toLocaleDateString()}
                      </span>
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-muted-foreground">Aucun historique</li>
                )}
              </ul>
            </PopoverContent>
          </Popover>
        );
      },
    },
    {
      accessorKey: "location",
      header: "Localisation",
      cell: ({ row }) => {
        const wilaya = row.original.wilaya?.wilaya_name || 'N/A';
        const commune =  row.original.commune?.commune_name || 'N/A';
        const livreur =  ' 🛵 ' + row.original.livreur?.name || 'non affecté';


        return (
          <div className="space-y-1">
            <p className="text-sm"> {wilaya} - {commune} </p>
            <p className="text-xs text-muted-foreground">
                {livreur}
            </p>
          </div>
        );
      },
    },
    {
      accessorKey: "created_at",
      header: () => (
        <div className="w-full text-center">
          La Date
        </div>
      ),
      cell: ({ row }) => {
        const date = new Date(row.original.created_at);
        return (
          <div className="text-sm text-muted-foreground text-center">
            {date.toLocaleDateString()}
            <br />
            {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' , hourCycle:'h23' })}
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const colie = row.original;

        const handleDelete = () => {
            router.delete(route('admin.colies.destroy', colie.id), {
                onSuccess: () => toast.success("Colis supprimé avec succès"),
                onError: () => toast.error("Erreur lors de la suppression"),
            });
        };

        const handleEdit = () => {
            router.get(route("admin.colies.edit", { colie: colie.id }));
        };



        return (
            <div className="flex  items-center space-x-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1 hover:bg-primary/10"
                    aria-label="Voir les détails du colis"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[350px] p-4">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Détails du Colis
                    </h3>

                    <div className="border rounded-lg overflow-hidden">
                      <table className="w-full text-sm bg-gray-100 dark:bg-zinc-900">
                        <tbody className="divide-y">
                          <tr>
                            <td className="py-3 px-4 text-gray-500 font-medium bg-gray-50 w-1/3 dark:bg-zinc-950 dark:text-white">Adresse</td>
                            <td className="py-3 px-4 font-medium">
                              {colie.client_address?.trim() ? colie.client_address : '/'}
                            </td>
                          </tr>
                          <tr>
                            <td className="py-3 px-4 text-gray-500 font-medium bg-gray-50 dark:bg-zinc-950 dark:text-white">Numéro de commande</td>
                            <td className="py-3 px-4 font-mono">
                              {colie.external_id?.trim() ? colie.external_id : '/'}
                            </td>
                          </tr>
                          <tr>
                            <td className="py-3 px-4 text-gray-500 font-medium bg-gray-50 dark:bg-zinc-950 dark:text-white">Produits</td>
                            <td className="py-3 px-4 font-medium">{colie.products}</td>
                          </tr>
                          <tr>
                            <td className="py-3 px-4 text-gray-500 font-medium bg-gray-50 dark:bg-zinc-950 dark:text-white">Montant Client</td>
                            <td className="py-3 px-4 font-medium text-primary">{colie.client_amount} DA</td>
                          </tr>
                          <tr>
                            <td className="py-3 px-4 text-gray-500 font-medium bg-gray-50 dark:bg-zinc-950 dark:text-white">Frais Livreur</td>
                            <td className="py-3 px-4 font-medium">{colie.livreur_amount} DA</td>
                          </tr>
                          <tr>
                            <td className="py-3 px-4 text-gray-500 font-medium bg-gray-50 dark:bg-zinc-950 dark:text-white">Valeur Produit</td>
                            <td className="py-3 px-4 font-medium">{colie.product_value} DA</td>
                          </tr>
                          <tr>
                            <td className="py-3 px-4 text-gray-500 font-medium bg-gray-50 dark:bg-zinc-950 dark:text-white">Frais de Retour</td>
                            <td className="py-3 px-4 font-medium">{colie.return_fee} DA</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>


                    {
                    colie.created_at !== colie.updated_at && (
                        <div className="flex justify-between items-center pt-2 text-sm">
                            <div className="flex items-center gap-2 text-gray-500 dark:text-white">
                            <CalendarDays className="h-4 w-4" />
                            <span>
                                {(() => {
                                const date = new Date(colie.updated_at);
                                return `Dernière mise à jour le ${date.toLocaleDateString('fr-FR', {
                                    day: '2-digit',
                                    month: 'long',
                                    year: 'numeric',
                                })} à ${date.toLocaleTimeString('fr-FR', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hourCycle : 'h23'
                                })}`;
                                })()}
                            </span>
                            </div>
                        </div>
                    )}
                  </div>
                </PopoverContent>
              </Popover>


                <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center"
                    onClick={()=>{window.open(route("admin.colies.bordereau", colie.id), '_blank')}}
                  >
                    <Printer />
                </Button>



              { (!colie.id_exchange_return && colie.status.status === 'En préparation') && (
                <>
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
                          Êtes-vous sûr de vouloir supprimer ce colis ?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>Supprimer</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </>
              )}
            </div>
        );

      },
    },
  ];


//   useEffect(() => {
//     console.log(selectedIds);
//   }, [selectedIds]);

  return (
    <AppLayout>
      <Head title="Liste des colies" />
      <div className="space-y-2">


        {/* Main Data Table */}
        <div className="p-4">
          <DataTable
            columns={columns}
            data={colies.data}
            statuses={statuses}
            selectedFilters={selectedFilters}
            colies_count={colies_count}
            selectedIds={selectedIds}
            paginationLinks={colies.links || []}
          />
        </div>
      </div>
    </AppLayout>
  );
}
