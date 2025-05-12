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
  email: z.string().email({ message: "Veuillez entrer une adresse e-mail valide." }),
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
          email: "",
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
      <Head title="Créer un Livreur" />
      <div className="flex flex-col p-3">

        {/* Header */}
        <div className="flex flex-row flex-wrap items-center justify-between gap-4 p-4 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Créer un Livreur</h1>
          <Button onClick={() => router.get(route("admin.livreurs"))} variant="outline" className="hover:bg-gray-100 dark:hover:bg-gray-700">
            <MoveLeft className="w-5 h-5 mr-2" />
            Retour
          </Button>
        </div>





        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-gray-700 p-6 rounded-lg shadow-sm mt-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                    {/* Nom Complet */}
                    <FormField
                        name="fullName"
                        control={form.control}
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nom complet</FormLabel>
                            <FormControl>
                            <Input className="bg-white dark:bg-zinc-900" placeholder="Nom et prénom" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />

                    {/* Téléphone */}
                    <FormField
                        name="phone"
                        control={form.control}
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Téléphone</FormLabel>
                            <FormControl>
                            <Input type="tel" className="bg-white dark:bg-zinc-900" placeholder="Téléphone" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />

                    {/* Email */}
                    <FormField
                        name="email"
                        control={form.control}
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>E-mail</FormLabel>
                            <FormControl>
                            <Input type="email" className="bg-white dark:bg-zinc-900" placeholder="Adresse e-mail" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />

                    {/* Wilaya Select Dropdown */}
                    <FormField
                        name="wilaya"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Wilaya (zone de livraison)</FormLabel>
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


                    {/* Password */}
                    <FormField
                        name="password"
                        control={form.control}
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Mot de passe</FormLabel>
                            <FormControl>
                            <Input type="password" className="bg-white dark:bg-zinc-900" placeholder="Mot de passe" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />

                    {/* Submit Button */}
                    <Button type="submit" className="bg-zinc-950 text-white hover:bg-zinc-950 w-full mt-4">Créer Livreur</Button>
                    </form>
                </Form>
        </div>



      </div>
    </AppLayout>
  );
}
