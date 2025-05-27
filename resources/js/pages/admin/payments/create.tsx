import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MoveLeft, Loader2 } from "lucide-react";
import { Head, router } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useEffect, useMemo, useState, useCallback } from "react";
import axios from "axios";

// Types
interface Livreur {
  id: number;
  name: string;
}
interface CreatePaymentProps {
  livreurs: Livreur[];
  errors?: Record<string, string>;
}

// Form Schema
const formSchema = z.object({
  livreur_id: z.string().min(1, { message: "Veuillez sélectionner un livreur." }),
});

type FormValues = z.infer<typeof formSchema>;

const EMPTY_PAYMENT_DATA = {
  total_client_payment: "0.00",
  total_courier_delivered_payment: "0.00",
  total_courier_returnfee_payment: "0.00",
  total_courier_net_payment: "0.00",
  total_store_payment: "0.00",
};

const formatCurrency = (value: string | number) =>
  new Intl.NumberFormat("fr-DZ", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(typeof value === "string" ? parseFloat(value) : value);

export default function CreatePayment({ livreurs, errors = {} }: CreatePaymentProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { livreur_id: "" },
  });

  const [paymentData, setPaymentData] = useState(EMPTY_PAYMENT_DATA);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hasNonZeroPayment = useMemo(() => {
    return Object.values(paymentData).some((v) => parseFloat(v) > 0);
  }, [paymentData]);

  useEffect(() => {
    if (Object.keys(errors).length) {
      for (const field in errors) {
        form.setError(field as keyof FormValues, {
          type: "server",
          message: errors[field],
        });
      }
    }
  }, [errors]);

  const handleLivreurChange = useCallback(
    async (livreurId: string) => {
      if (livreurId === form.getValues().livreur_id) return;
      form.setValue("livreur_id", livreurId);
      setIsLoading(true);

      try {
        const { data } = await axios.get(route("admin.payments.calculate", { livreur: livreurId }));
        setPaymentData({
          total_client_payment: data.total_client_payment ?? "0.00",
          total_courier_delivered_payment: data.total_courier_delivered_payment ?? "0.00",
          total_courier_returnfee_payment: data.total_courier_returnfee_payment ?? "0.00",
          total_courier_net_payment: data.total_courier_net_payment ?? "0.00",
          total_store_payment: data.total_store_payment ?? "0.00",
        });
      } catch (error: any) {
        console.error("Erreur:", error);
        toast.error(
          error.response?.data?.message || "Erreur lors du calcul du paiement."
        );
        setPaymentData(EMPTY_PAYMENT_DATA);
      } finally {
        setIsLoading(false);
      }
    },
    [form]
  );

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      await router.post(
        route("admin.payments.store"),
        { ...values, ...paymentData },
        {
          onSuccess: () => {
            const audio = new Audio('/sounds/payment.mp3');
            audio.play();
            toast.success("Paiement enregistré !");
            form.reset();
            setPaymentData(EMPTY_PAYMENT_DATA);
          },
          onError: () => toast.error("Erreur lors de l'enregistrement."),
        }
      );
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("Une erreur inattendue est survenue.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppLayout>
      <Head title="Créer un Paiement" />
      <div className="p-4 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Créer un Paiement</h1>
          <Button variant="outline" onClick={() => router.get(route("admin.payments"))} className="gap-2">
            <MoveLeft className="w-4 h-4" />
            Retour
          </Button>
        </div>

        <div className="bg-card border rounded-lg shadow-sm p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <p className="text-sm text-muted-foreground">
                Veuillez sélectionner un livreur pour calculer les montants automatiquement.
              </p>

              {/* Livreur Field */}
              <FormField
                name="livreur_id"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Livreur</FormLabel>
                    <Select onValueChange={handleLivreurChange} value={field.value} disabled={isLoading}>
                      <FormControl>
                        <SelectTrigger>
                          {isLoading ? (
                            <div className="flex items-center gap-2">
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Chargement...
                            </div>
                          ) : (
                            <SelectValue placeholder="Sélectionner un livreur..." />
                          )}
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {livreurs.map((livreur) => (
                          <SelectItem key={livreur.id} value={String(livreur.id)}>
                            {livreur.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Explanation */}
              <div className="p-4 border rounded-lg text-sm bg-zinc-50 dark:bg-zinc-800">
                <p className="mb-2 font-medium text-zinc-700 dark:text-zinc-200">💡 Explication des montants :</p>
                <ul className="list-disc list-inside text-zinc-600 dark:text-zinc-300 space-y-1">
                    <li><strong>Montant des Clients</strong> : montant total collecté pour les colis</li>
                    <li><strong>Livraisons Réussies</strong> : gain total du livreur pour les colis livrés</li>
                    <li><strong>Frais de Retour</strong> : nombre de colis retournés × frais de retour</li>
                    <li><strong>Total Livreur</strong> = Livraisons Réussies + Frais de Retour</li>
                    <li><strong>Montant Magasin</strong> = Montant des Clients - Total Livreur</li>
                </ul>
              </div>

                {/* Montants */}
                <div className="space-y-4">
                {/* Full width - First input */}
                <InputBlock
                    label="Montant des Clients"
                    value={paymentData.total_client_payment}
                    color="text-red-600"
                    span={6}
                />

                {/* Row with 3 inputs side by side on medium screens */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <InputBlock
                    label="Livraisons Réussies"
                    value={paymentData.total_courier_delivered_payment}
                    span={2}
                    />
                    <InputBlock
                    label="Frais de Retour"
                    value={paymentData.total_courier_returnfee_payment}
                    span={2}
                    />
                    <InputBlock
                    label="Total Livreur"
                    value={paymentData.total_courier_net_payment}
                    span={2}
                    />
                </div>

                {/* Full width - Last input */}
                <InputBlock
                    label="Montant Magasin"
                    value={paymentData.total_store_payment}
                    color="text-green-600"
                    large
                    span={6}
                />
                </div>


              <Button
                type="submit"
                className="w-full dark:bg-green-800 dark:text-white"
                size="lg"
                disabled={!hasNonZeroPayment || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enregistrement...
                  </>
                ) : (
                  "Confirmer le Paiement"
                )}
              </Button>

              {!hasNonZeroPayment && (
                <p className="text-sm text-muted-foreground text-center">
                  Aucun paiement à enregistrer.
                </p>
              )}
            </form>
          </Form>
        </div>
      </div>
    </AppLayout>
  );
}

// Extracted component for payment input
function InputBlock({
  label,
  value,
  span,
  color = "text-orange-600",
  large = false,
}: {
  label: string;
  value: string;
  span: number;
  color?: string;
  large?: boolean;
}) {
  return (
    <div className={`space-y-2 md:col-span-${span}`}>
      <FormLabel>{label} (DZD)</FormLabel>
      <Input
        readOnly
        value={formatCurrency(value)}
        className={`w-full font-mono ${large ? "text-2xl" : "text-lg"} font-bold ${color}`}
      />
    </div>
  );
}
