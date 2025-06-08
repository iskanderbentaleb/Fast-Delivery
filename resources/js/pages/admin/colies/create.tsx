'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MoveLeft, Loader2, LockKeyholeOpen, LockKeyhole } from "lucide-react";
import { Head, router } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface Wilaya {
  id: string;
  wilaya_name: string;
}

interface Commune {
  id: string;
  commune_name: string;
  wilaya_id: string;
}

interface Livreur {
  livreur_id: string;
  livreur_name: string;
  delivery_price: number;
  return_price: number;
  commune_name: string;
}

interface CreateColisProps {
  wilayas: Wilaya[];
  errors: Record<string, string>;
  communes: Commune[];
  livreurs: Livreur[];
  selectedWilaya?: string;
  selectedCommune?: string;
}

const formSchema = z.object({
  fullName: z.string().trim().min(2, "Le nom complet doit contenir au moins 2 caractères"),
  phone: z.string()
  .refine((val) => {
    const numbers = val.split(",").map(n => n.trim());
    return numbers.every(n => /^[0-9]+$/.test(n));
  }, {
    message: "Chaque numéro doit contenir uniquement des chiffres",
  })
  .refine((val) => {
    const numbers = val.split(",").map(n => n.trim());
    return numbers.every(n => n.length >= 10);
  }, {
    message: "Chaque numéro doit contenir au moins 10 chiffres",
  }),
  wilaya: z.string().trim().min(1, "La wilaya est requise"),
  commune: z.string().trim().min(1, "La commune est requise"),
  adress: z.string().min(1, "L'adresse est requise"),
  product: z.string().trim().min(3, "La description du produit doit contenir au moins 3 caractères"),
  exchangeProduct: z.string().optional(),
  valueExchangeProduct: z.string().optional(),
  prix_avec_livraison: z.string().min(1, "Le prix est requis")
    .regex(/^\d+(\.\d{1,2})?$/, "Le prix doit être un nombre valide"),
  numero_commande: z.string().optional(),
  delivery_price: z.string().min(1, "Le prix de livraison est requis")
    .regex(/^\d+(\.\d{1,2})?$/, "Le prix doit être un nombre valide"),
  product_value: z.string().min(1, "La valeur declaré est requis")
    .regex(/^\d+(\.\d{1,2})?$/, "Le prix doit être un nombre valide"),
  return_price: z.string().min(1, "Le prix de retour est requis")
    .regex(/^\d+(\.\d{1,2})?$/, "Le prix doit être un nombre valide"),
  livreur_id: z.string().trim().min(1, "Le livreur est requis"),
}).superRefine((data, ctx) => {
    if (data.exchangeProduct && !data.valueExchangeProduct) {
      ctx.addIssue({
        path: ['valueExchangeProduct'],
        code: z.ZodIssueCode.custom,
        message: "Ce champ est requis si un produit d’échange est fourni.",
      });
    }
  });

type FormValues = z.infer<typeof formSchema>;

export default function CreateColis({
  wilayas,
  errors,
  communes: initialCommunes,
  livreurs: initialLivreurs,
  selectedWilaya,
  selectedCommune
}: CreateColisProps) {
  const [communes, setCommunes] = useState<Commune[]>(initialCommunes || []);
  const [livreurs, setLivreurs] = useState<Livreur[]>(initialLivreurs || []);
  const [loadingCommunes, setLoadingCommunes] = useState(false);
  const [loadingLivreurs, setLoadingLivreurs] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      wilaya: selectedWilaya || '',
      commune: selectedCommune || '',
      adress: "",
      product: "",
      exchangeProduct: "",
      valueExchangeProduct: "",
      prix_avec_livraison: "",
      numero_commande: "",
      delivery_price: "",
      product_value: "",
      return_price: "",
      livreur_id: "",
    },
  });

  useEffect(() => {
    Object.keys(errors).forEach((field) => {
      form.setError(field as keyof FormValues, {
        type: "server",
        message: errors[field],
      });
    });
  }, [errors, form]);

  const handleWilayaChange = (wilayaId: string) => {
    form.resetField('commune');
    form.resetField('livreur_id');
    form.resetField('delivery_price');
    form.resetField('return_price');
    setLivreurs([]);

    if (!wilayaId) {
      setCommunes([]);
      return;
    }

    setLoadingCommunes(true);
    router.get(route('admin.colies.create'), { wilaya_id: wilayaId }, {
      preserveState: true,
      onSuccess: (page) => {
        setCommunes(page.props.communes);
      },
      onFinish: () => setLoadingCommunes(false)
    });
  };

  const handleCommuneChange = (communeId: string) => {
    form.resetField('livreur_id');
    form.resetField('delivery_price');
    form.resetField('return_price');

    if (!communeId) {
      setLivreurs([]);
      return;
    }

    setLoadingLivreurs(true);
    router.get(route('admin.colies.create'), {
      wilaya_id: form.getValues('wilaya'),
      commune_id: communeId
    }, {
      preserveState: true,
      onSuccess: (page) => {
        setLivreurs(page.props.livreurs);
      },
      onFinish: () => setLoadingLivreurs(false)
    });
  };

  const onSubmit = (values: FormValues) => {
    router.post(route("admin.colies.store"), values, {
      onSuccess: () => {
        toast.success("Colis créé avec succès 🎉 !");
        form.reset();
      },
      onError: () => {
        toast.error("Une erreur s'est produite ❌, Veuillez réessayer.");
      },
    });
  };

  function formatPrice(value: number | string) {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return isNaN(num) ? '0.00' : num.toFixed(2);
  }

  return (
    <AppLayout>
      <Head title="Ajouter un colis" />
      <div className="flex flex-col p-3">
        <div className="flex justify-between items-center border-b p-4">
          <h1 className="text-xl font-semibold">Ajouter un colis</h1>
          <Button onClick={() => router.get(route("admin.colies"))} variant="outline">
            <MoveLeft className="w-5 h-5 mr-2" /> Retour
          </Button>
        </div>

        <div className="bg-white dark:bg-zinc-900 border p-6 rounded-xl shadow-sm mt-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col md:flex-row md:justify-between gap-6">
              <div className="w-full md:w-[48%] space-y-3">
                {/* Full Name */}
                <FormField
                  name="fullName"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom complet</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="bg-white dark:bg-zinc-900"
                          placeholder="Nom et prénom"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Phone */}
                <FormField
                  name="phone"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Téléphone</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="bg-white dark:bg-zinc-900"
                          placeholder="Téléphone"
                          inputMode="tel"
                          onChange={(e) => {
                            const rawValue = e.target.value.replace(/\D/g, ""); // remove non-digits
                            const chunks = rawValue.match(/.{1,10}/g) || [];
                            const formatted = chunks.join(",");
                            field.onChange(formatted);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Wilaya */}
                <FormField
                  name="wilaya"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Wilaya</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          handleWilayaChange(value);
                        }}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-white dark:bg-zinc-900">
                            <SelectValue placeholder="Sélectionner une wilaya" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {wilayas.map((w) => (
                            <SelectItem key={w.id} value={String(w.id)}>
                              {w.wilaya_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Commune */}
                <FormField
                  name="commune"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Commune</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          handleCommuneChange(value);
                        }}
                        value={String(field.value)}
                        disabled={!form.watch('wilaya') || loadingCommunes}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-white dark:bg-zinc-900">
                            <div className="flex items-center gap-2">
                              {loadingCommunes && <Loader2 className="h-4 w-4 animate-spin" />}
                              <SelectValue placeholder={
                                loadingCommunes ? "Chargement..." : "Sélectionner une commune"
                              } />
                            </div>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {communes.length > 0 ? (
                            communes.map((commune) => (
                              <SelectItem key={commune.id} value={String(commune.id)}>
                                {commune.commune_name}
                              </SelectItem>
                            ))
                          ) : (
                            <div className="py-2 text-center text-sm text-muted-foreground">
                              {form.watch('wilaya') ? "Aucune commune trouvée !" : "Sélectionnez d'abord une wilaya"}
                            </div>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Livreur */}
                <FormField
                name="livreur_id"
                control={form.control}
                render={({ field }) => {
                    const selectedLivreur = livreurs.find(l => l.livreur_id == field.value);
                    return (
                    <FormItem>
                        <FormLabel>Livreur</FormLabel>
                        <Select
                        onValueChange={(value) => {
                            field.onChange(value);
                            const livreur = livreurs.find(l => l.livreur_id == value);
                            if (livreur) {
                            form.setValue('delivery_price', formatPrice(livreur.delivery_price));
                            form.setValue('return_price', formatPrice(livreur.return_price));
                            }
                        }}
                        value={field.value}
                        disabled={!form.watch('commune') || loadingLivreurs}
                        >
                        <FormControl>
                            <SelectTrigger className="bg-white dark:bg-zinc-900 w-full">
                            <div className="flex items-center gap-2 w-full">
                                {loadingLivreurs && <Loader2 className="h-4 w-4 animate-spin flex-shrink-0" />}
                                <SelectValue
                                placeholder={loadingLivreurs ? "Chargement..." : "Sélectionner un livreur"}
                                className="truncate"
                                >
                                {selectedLivreur && (
                                    <div className="flex items-center gap-1 truncate">
                                    <span className="truncate">{selectedLivreur.livreur_name}</span>
                                    <span className="hidden sm:inline-flex ml-2 rounded-md border border-green-600 bg-green-100 px-1.5 py-0.5 text-[0.6rem] text-green-800">
                                        {formatPrice(selectedLivreur.delivery_price)} DA
                                    </span>
                                    </div>
                                )}
                                </SelectValue>
                            </div>
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent className="w-[var(--radix-select-trigger-width)] max-w-[calc(100vw-2rem)]">
                            {livreurs.length > 0 ? (
                            livreurs.map((livreur) => (
                                <SelectItem
                                key={livreur.livreur_id}
                                value={String(livreur.livreur_id)}
                                className="px-3 py-2"
                                >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-3 w-full">
                                    <span className="font-medium truncate ml-5">{livreur.livreur_name}</span>
                                    <div className="flex gap-1.5 ml-5">
                                        <span className="inline-flex items-center rounded-md border border-green-600 bg-green-100 px-2 py-0.5 text-xs text-green-800">
                                            {formatPrice(livreur.delivery_price)} DA
                                        </span>
                                        <span className="inline-flex items-center rounded-md border border-red-600 bg-red-100 px-2 py-0.5 text-xs text-red-800">
                                            {formatPrice(livreur.return_price)} DA
                                        </span>
                                    </div>
                                </div>
                                </SelectItem>
                            ))
                            ) : (
                            <div className="py-2 text-center text-sm text-muted-foreground px-3">
                                {form.watch('commune') ? "Aucun livreur disponible !" : "Sélectionnez d'abord une commune"}
                            </div>
                            )}
                        </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                    );
                }}
                />


                {/* Delivery Price */}
                <FormField
                  name="delivery_price"
                  control={form.control}
                  render={({ field }) => {
                    const [isEditable, setIsEditable] = useState(false);
                    return (
                      <FormItem>
                        <FormLabel>Prix de livraison</FormLabel>
                        <div className="flex items-center gap-2">
                          <FormControl>
                            <Input
                              {...field}
                              className="border border-green-600 bg-green-100 text-green-900 placeholder-green-700 dark:bg-green-900 dark:border-green-500 dark:text-green-200"
                              inputMode="decimal"
                              readOnly={!isEditable}
                              placeholder="0.00"
                              onChange={(e) => {
                                const value = e.target.value;
                                if (/^\d*\.?\d{0,2}$/.test(value)) {
                                  field.onChange(value);
                                }
                              }}
                            />
                          </FormControl>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setIsEditable(!isEditable)}
                          >
                            {isEditable ? (
                              <LockKeyholeOpen className="h-4 w-4" />
                            ) : (
                              <LockKeyhole className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />

                {/* Return Price */}
                <FormField
                  name="return_price"
                  control={form.control}
                  render={({ field }) => {
                    const [isEditable, setIsEditable] = useState(false);
                    return (
                      <FormItem>
                        <FormLabel>Prix de retour</FormLabel>
                        <div className="flex items-center gap-2">
                          <FormControl>
                            <Input
                              {...field}
                              className="border border-red-600 bg-red-100 text-red-900 placeholder-red-700 dark:bg-red-900 dark:border-red-500 dark:text-red-200"
                              inputMode="decimal"
                              readOnly={!isEditable}
                              placeholder="0.00"
                              onChange={(e) => {
                                const value = e.target.value;
                                if (/^\d*\.?\d{0,2}$/.test(value)) {
                                  field.onChange(value);
                                }
                              }}
                            />
                          </FormControl>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setIsEditable(!isEditable)}
                          >
                            {isEditable ? (
                              <LockKeyholeOpen className="h-4 w-4" />
                            ) : (
                              <LockKeyhole className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />

                {/* Address */}
                <FormField
                  name="adress"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Adresse</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="bg-white dark:bg-zinc-900"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Product */}
                <FormField
                  name="product"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Produit(s)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="bg-white dark:bg-zinc-900"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Prix avec livraison */}
                <FormField
                  name="prix_avec_livraison"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prix (avec livraison)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="bg-white dark:bg-zinc-900"
                          inputMode="decimal"
                          placeholder="0.00"
                          onChange={(e) => {
                            const value = e.target.value;
                            if (/^\d*\.?\d{0,2}$/.test(value)) {
                              field.onChange(value);
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* value real of product(s) */}
                <FormField
                  name="product_value"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>La valeur déclarée (la valeur du contenu du colis)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="bg-white dark:bg-zinc-900"
                          inputMode="decimal"
                          placeholder="0.00"
                          onChange={(e) => {
                            const value = e.target.value;
                            if (/^\d*\.?\d{0,2}$/.test(value)) {
                              field.onChange(value);
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Numéro de commande */}
                <FormField
                  name="numero_commande"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Numéro de commande</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="bg-white dark:bg-zinc-900"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Exchange Product */}
                <Accordion type="single" collapsible className="border rounded-md bg-white dark:bg-zinc-900">
                  <AccordionItem value="item-1" className="border-b px-4 py-2">
                    <AccordionTrigger>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        Demander un échange après livraison ?
                        <br />
                        <span className="text-xs font-normal text-gray-600 dark:text-gray-400">
                          (ceci va créer un second bordereau pour le retour de l'objet à échanger)
                        </span>
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4 px-2">
                        <FormField
                            name="exchangeProduct"
                            control={form.control}
                            render={({ field }) => (
                            <FormItem className="space-y-2">
                                <FormLabel>Produit(s) à échanger</FormLabel>
                                <FormControl>
                                <Input {...field} className="bg-white dark:bg-zinc-900 px-3 py-2 text-sm border rounded-md" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    </AccordionContent>
                    <AccordionContent className="pt-4 px-2">
                        <FormField
                            name="valueExchangeProduct"
                            control={form.control}
                            render={({ field }) => (
                            <FormItem className="space-y-2">
                                <FormLabel>La valeur déclarée de retour</FormLabel>
                                <FormControl>
                                    <Input
                                    {...field}
                                    className="bg-white dark:bg-zinc-900"
                                    inputMode="decimal"
                                    placeholder="0.00"
                                    onChange={(e) => {
                                    const value = e.target.value;
                                    if (/^\d*\.?\d{0,2}$/.test(value)) {
                                        field.onChange(value);
                                    }
                                    }}
                                />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>

              {/* Divider */}
              <div className="hidden md:flex justify-center items-center">
                <div className="w-px h-full bg-gray-300 dark:bg-gray-700" />
              </div>

              {/* Right side */}
              <div className="w-full md:w-[48%]">
                <div className="p-4 bg-gray-50 dark:bg-zinc-800 border rounded-lg shadow-sm">
                  <h2 className="text-base font-semibold mb-4">🧾 Résumé de la facture</h2>

                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600 dark:text-gray-400">
                      Frais de retour <span className="italic"><br/>(en cas de retour du colis)</span>
                    </span>
                    <span className="font-medium">
                      {formatPrice(form.watch("return_price"))} DA
                    </span>
                  </div>

                  <div className="border-t border-gray-200 dark:border-zinc-700 my-2" />

                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600 dark:text-gray-400">Frais de livraison</span>
                    <span className="font-medium">
                      {formatPrice(form.watch("delivery_price"))} DA
                    </span>
                  </div>

                  <div className="border-t border-gray-200 dark:border-zinc-700 my-2" />

                <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600 dark:text-gray-400">Montant à recevoir</span>
                    <span className="font-medium">
                        {formatPrice(
                        (parseFloat(form.watch("prix_avec_livraison") || "0") || 0) -
                        (parseFloat(form.watch("delivery_price") || "0") || 0)
                        )} DA
                    </span>
                </div>

                  <div className="border-t border-gray-300 dark:border-zinc-600 my-2" />

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Total</span>
                    <span className="font-semibold">
                      {formatPrice(form.watch("prix_avec_livraison"))} DA
                    </span>
                  </div>
                </div>
              </div>
            </form>

            <div className="mt-2">
              <Button
                type="submit"
                className="bg-zinc-950 text-white hover:bg-zinc-950 w-full mt-4"
                disabled={loadingCommunes || loadingLivreurs || form.formState.isSubmitting}
                onClick={form.handleSubmit(onSubmit)}
              >
                {form.formState.isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    En cours...
                  </div>
                ) : (
                  "Créer le colis"
                )}
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </AppLayout>
  );
}
