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
import { MoveLeft } from "lucide-react";
import { Head, router } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useEffect } from "react";
import { toast } from "sonner";



// Define Wilaya Type
interface Wilaya {
  id: string;
  wilaya_name: string;
}

// Props for the Component
interface CreateLivreurProps {
  wilayas: Wilaya[];
}

// Form Validation Schema
const formSchema = z.object({
  fullName: z.string().min(2, "Le nom complet doit avoir au moins 2 caractères."),
  phone: z.string().min(10, "Le numéro de téléphone doit contenir au moins 10 chiffres."),
  wilaya: z.string().min(1, { message: "Veuillez sélectionner une Wilaya." }),
  password: z.string().min(6, { message: "Le mot de passe doit contenir au moins 6 caractères." }),
});

// Infer the type from schema
type FormValues = z.infer<typeof formSchema>;

interface FieldErrors {
  [key: string]: string;
}

export default function CreateLivreur({ wilayas, errors }: CreateLivreurProps & { errors: FieldErrors }) {
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          fullName: "",
          phone: "",
          wilaya: "",
          password: "",
        },
      });

      // Update errors when they come from Inertia
      useEffect(() => {
        Object.keys(errors).forEach((field) => {
          form.setError(field as keyof FormValues, { type: "server", message: errors[field] });
        });
      }, [errors, form]); // Run this when errors change

      const onSubmit = (values: FormValues) => {
        router.post(route("admin.livreurs.store"), values, {
          onSuccess: () => {
            toast("Livreur créé avec succès ! 🎉");
            form.reset();
          },
          onError: () => {
            toast.error("Une erreur s'est produite. Veuillez réessayer.");
          },
        });
      };

  return (
    <AppLayout>
      <Head title="Ajouter un colis" />
      <div className="flex flex-col p-3">

        {/* Header */}
        <div className="flex flex-row flex-wrap items-center justify-between gap-4 p-4 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Ajouter un colis</h1>
          <Button onClick={() => router.get(route("admin.livreurs"))} variant="outline" className="hover:bg-gray-100 dark:hover:bg-gray-700">
            <MoveLeft className="w-5 h-5 mr-2" />
            Retour
          </Button>
        </div>



    <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-gray-700 p-6 rounded-xl shadow-sm mt-6">
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col md:flex-row md:justify-between gap-6">

            {/* Left Side: Form Inputs */}
            <div className="w-full md:w-[48%] space-y-5">
                <FormField
                name="fullName"
                control={form.control}
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Nom complet</FormLabel>
                    <FormControl>
                        <Input placeholder="Nom et prénom" className="bg-white dark:bg-zinc-900" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />

                <FormField
                name="phone"
                control={form.control}
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Téléphone</FormLabel>
                    <FormControl>
                        <Input type="tel" placeholder="Téléphone" className="bg-white dark:bg-zinc-900" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />

                <FormField
                name="wilaya"
                control={form.control}
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Wilaya</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                        <SelectTrigger className="bg-white dark:bg-zinc-900">
                            <SelectValue placeholder="Sélectionner une wilaya" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        {wilayas.map((wilaya) => (
                            <SelectItem key={wilaya.id} value={String(wilaya.id)}>
                            {wilaya.wilaya_name}
                            </SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />

                <FormField
                name="commune"
                control={form.control}
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Commune</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                        <SelectTrigger className="bg-white dark:bg-zinc-900">
                            <SelectValue placeholder="Sélectionner une commune" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        {/* Communes to be loaded dynamically */}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />

                <FormField
                name="adress"
                control={form.control}
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Adresse</FormLabel>
                    <FormControl>
                        <Input placeholder="Adresse complète" className="bg-white dark:bg-zinc-900" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />

                <FormField
                name="product"
                control={form.control}
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Produit(s)</FormLabel>
                    <FormControl>
                        <Input placeholder="Nom du produit" className="bg-white dark:bg-zinc-900" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />

                <FormField
                name="prix_avec_livraison"
                control={form.control}
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Prix (avec livraison)</FormLabel>
                    <FormControl>
                        <Input type="tel" placeholder="Prix total" className="bg-white dark:bg-zinc-900" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />

                <FormField
                name="numero_commande"
                control={form.control}
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Numéro de commande (externe)</FormLabel>
                    <FormControl>
                        <Input placeholder="Référence externe" className="bg-white dark:bg-zinc-900" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />

                <FormField
                name="delivery_price"
                control={form.control}
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Prix de livraison</FormLabel>
                    <FormControl>
                        <Input type="tel" placeholder="Prix de livraison" className="bg-white dark:bg-zinc-900" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>

            {/* Vertical Separator */}
            <div className="hidden md:flex justify-center items-center">
                <div className="w-px h-[100%] bg-gray-300 dark:bg-gray-700" />
            </div>

            {/* Right Side: Facture */}
            <div className="w-full md:w-[48%] flex flex-col justify-start">
                <div className="p-4 rounded-lg bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-gray-700 shadow-sm">
                <h2 className="text-base font-semibold mb-4">🧾 Facture</h2>

                <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600 dark:text-gray-400">Prix de livraison</span>
                    <span className="font-medium">{form.watch("delivery_price") || "0"} DA</span>
                </div>

                <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Total</span>
                    <span className="font-semibold">{form.watch("prix_avec_livraison") || "0"} DA</span>
                </div>
                </div>
            </div>
            </form>

            {/* Submit Button */}
            <div className="mt-6">
            <Button type="submit" className="bg-zinc-950 text-white hover:bg-zinc-800 w-full h-12 text-base">
                Créer le colis
            </Button>
            </div>
        </Form>
    </div>







      </div>
    </AppLayout>
  );
}
