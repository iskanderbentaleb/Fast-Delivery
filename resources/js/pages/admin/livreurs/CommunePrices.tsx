import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { router } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Save } from "lucide-react";

export function CommunePrices({
  livreurId,
  communes,
  communePrices,
}: {
  livreurId: number;
  communes: { id: number; commune_name: string }[];
  communePrices: { commune_id: number; delivery_price: number; return_price: number }[] | undefined;
}) {
  const [prices, setPrices] = useState<Record<number, { delivery_price: number; return_price: number }>>({});
  const [originalPrices, setOriginalPrices] = useState<Record<number, { delivery_price: number; return_price: number }>>({});
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<"apply-global" | "save" | null>(null);
  const [pendingField, setPendingField] = useState<"delivery_price" | "return_price" | null>(null);
  const [pendingValue, setPendingValue] = useState<number | null>(null);

  useEffect(() => {
    console.log("communePrices:", communePrices); // Debug the incoming prices data

    if (Array.isArray(communePrices)) {
      const initial: Record<number, { delivery_price: number; return_price: number }> = {};
      const original: Record<number, { delivery_price: number; return_price: number }> = {};

      for (const price of communePrices) {
        initial[price.commune_id] = {
          delivery_price: price.delivery_price,
          return_price: price.return_price,
        };
        original[price.commune_id] = {
          delivery_price: price.delivery_price,
          return_price: price.return_price,
        };
      }

      setPrices(initial);
      setOriginalPrices(original);
    }
  }, [communePrices]);

  const triggerGlobalDialog = (field: "delivery_price" | "return_price", value: string) => {
    const parsed = parseFloat(value);
    if (!value.trim() || isNaN(parsed) || parsed < 0) return;

    // Prevent unnecessary dialog if all prices already match
    const allSame = communes.every(
      (commune) => prices[commune.id]?.[field] === parsed
    );
    if (allSame) return;

    setDialogType("apply-global");
    setPendingField(field);
    setPendingValue(parsed);
    setDialogOpen(true);
  };

  const handleChange = (
    id: number,
    field: "delivery_price" | "return_price",
    value: string
  ) => {
    const parsed = parseFloat(value);
    console.log(`Updating ${field} for commune ${id} with value ${value}`);

    if (isNaN(parsed) || parsed < 0) return;

    setPrices((prev) => ({
      ...prev,
      [id]: {
        delivery_price: field === "delivery_price" ? parsed : prev[id]?.delivery_price ?? 0,
        return_price: field === "return_price" ? parsed : prev[id]?.return_price ?? 0,
      },
    }));
  };

  const confirmAction = () => {
    if (dialogType === "apply-global" && pendingField && pendingValue !== null) {
      setPrices((prev) => {
        const updated: typeof prices = {};

        for (const commune of communes) {
          const existing = prev[commune.id] ?? { delivery_price: 0, return_price: 0 };
          updated[commune.id] = {
            ...existing,
            [pendingField]: pendingValue,
          };
        }

        return updated;
      });
    }

    if (dialogType === "save") {
      setSaving(true);
      router.post(
        route("admin.livreurs.savePrices", { id: livreurId }),
        {
          prices: Object.entries(prices).map(([id, price]) => ({
            commune_id: Number(id),
            ...price,
          })),
        },
        {
          onSuccess: () => toast("Prix enregistrés ! 🎉"),
          onError: () => toast.error("Erreur lors de l'enregistrement. ❌"),
          onFinish: () => setSaving(false),
        }
      );
    }

    setDialogOpen(false);
    setDialogType(null);
    setPendingField(null);
    setPendingValue(null);
  };

  const handleSaveClick = () => {
    setDialogType("save");
    setDialogOpen(true);
  };

  const isSaveDisabled =
    saving ||
    Object.keys(prices).length === 0 ||
    Object.values(prices).every(
      (p, id) =>
        p.delivery_price === originalPrices[id]?.delivery_price &&
        p.return_price === originalPrices[id]?.return_price
    );

  return (
    <>
      <div className="w-full overflow-x-auto">
        <table className="w-full text-sm border border-gray-200 dark:border-zinc-800">
          <thead className="bg-gray-100 dark:bg-zinc-900">
            <tr>
              <th className="text-left px-2 py-1 border-b">Commune</th>
              <th className="text-left px-2 py-1 border-b">Prix Livraison (DA)</th>
              <th className="text-left px-2 py-1 border-b">Prix Retour (DA)</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-yellow-50 dark:bg-zinc-900 border-b">
              <td className="px-2 py-1 font-medium">Global (Tous)</td>
              <td className="px-2 py-1">
                <input
                  type="number"
                  min={0}
                  className="w-full h-8 px-2 rounded border text-sm"
                  placeholder="0"
                  onBlur={(e) => triggerGlobalDialog("delivery_price", e.target.value)}
                />
              </td>
              <td className="px-2 py-1">
                <input
                  type="number"
                  min={0}
                  className="w-full h-8 px-2 rounded border text-sm"
                  placeholder="0"
                  onBlur={(e) => triggerGlobalDialog("return_price", e.target.value)}
                />
              </td>
            </tr>

            <tr className="bg-gray-200 dark:bg-zinc-800">
              <td className="px-2 py-1 font-semibold" colSpan={3}>
                Wilaya
              </td>
            </tr>

            {communes.map((commune) => (
              <tr key={commune.id} className="border-b">
                <td className="px-2 py-1 truncate">{commune.commune_name}</td>
                <td className="px-2 py-1">
                  <input
                    type="number"
                    min={0}
                    className="w-full h-8 px-2 rounded border text-sm"
                    placeholder="0"
                    value={prices[commune.id]?.delivery_price ?? 0}
                    onChange={(e) =>
                      handleChange(commune.id, "delivery_price", e.target.value)
                    }
                  />
                </td>
                <td className="px-2 py-1">
                  <input
                    type="number"
                    min={0}
                    className="w-full h-8 px-2 rounded border text-sm"
                    placeholder="0"
                    value={prices[commune.id]?.return_price ?? 0}
                    onChange={(e) =>
                      handleChange(commune.id, "return_price", e.target.value)
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Button
          onClick={handleSaveClick}
          disabled={isSaveDisabled}
          size="sm"
          className="w-full mt-4"
        >
          {saving ? (
            <>
              Enregistrement...
              <svg
                className="ml-2 w-4 h-4 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
            </>
          ) : (
            <>
              Enregistrer
              <Save className="ml-2 w-4 h-4" />
            </>
          )}
        </Button>
      </div>

      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {dialogType === "apply-global"
                ? "Appliquer les prix globalement ?"
                : "Confirmer l'enregistrement ?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {dialogType === "apply-global"
                ? "Cela remplacera tous les prix existants pour toutes les communes affichées."
                : "Vous êtes sur le point d'enregistrer les prix. Confirmez-vous ?"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmAction}>Continuer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
