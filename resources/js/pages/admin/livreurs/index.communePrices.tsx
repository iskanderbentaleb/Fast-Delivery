import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { router } from "@inertiajs/react";
import { useState } from "react";
import { toast } from "sonner";

export function CommunePrices({
  livreurId,
  communes,
}: {
  livreurId: number;
  communes: { id: number; commune_name: string }[];
}) {
  const [prices, setPrices] = useState<{ [key: number]: { delivery_price: number; return_price: number } }>({});
  const [saving, setSaving] = useState(false);

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<"apply-global" | "save" | null>(null);
  const [pendingField, setPendingField] = useState<"delivery_price" | "return_price" | null>(null);
  const [pendingValue, setPendingValue] = useState<number | null>(null);

  const confirmAction = () => {
    if (dialogType === "apply-global" && pendingField && pendingValue !== null) {
      setPrices((prev) => {
        const updated: typeof prices = {};
        for (const commune of communes) {
          updated[commune.id] = {
            delivery_price:
              pendingField === "delivery_price"
                ? pendingValue
                : prev[commune.id]?.delivery_price ?? 0,
            return_price:
              pendingField === "return_price"
                ? pendingValue
                : prev[commune.id]?.return_price ?? 0,
          };
        }
        return updated;
      });
    }

    if (dialogType === "save") {
      setSaving(true);
      router.post(
        route("admin.livreurs.savePrices", { id: livreurId }),
        { prices },
        {
          onSuccess: () => toast("Prix enregistrés !"),
          onError: () => toast.error("Erreur lors de l'enregistrement."),
          onFinish: () => setSaving(false),
        }
      );
    }

    // Reset dialog state
    setDialogOpen(false);
    setDialogType(null);
    setPendingField(null);
    setPendingValue(null);
  };

  const handleGlobalInputChange = (field: "delivery_price" | "return_price", value: string) => {
    const parsed = parseFloat(value);
    if (isNaN(parsed) || parsed < 0) return;

    setPrices((prev) => {
      const updated: typeof prices = {};
      for (const commune of communes) {
        updated[commune.id] = {
          delivery_price:
            field === "delivery_price"
              ? parsed
              : prev[commune.id]?.delivery_price ?? 0,
          return_price:
            field === "return_price"
              ? parsed
              : prev[commune.id]?.return_price ?? 0,
        };
      }
      return updated;
    });
  };


  const handleChange = (
    id: number,
    field: "delivery_price" | "return_price",
    value: string
  ) => {
    const parsed = parseFloat(value);
    if (isNaN(parsed) || parsed < 0) return;
    setPrices((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: parsed,
      },
    }));
  };

  const handleSaveClick = () => {
    setDialogType("save");
    setDialogOpen(true);
  };

  const isSaveDisabled =
    saving ||
    Object.keys(prices).length === 0 ||
    Object.values(prices).some(
      (p) =>
        typeof p.delivery_price !== "number" ||
        typeof p.return_price !== "number"
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
            {/* Global Input Row */}
            <tr className="bg-yellow-50 dark:bg-zinc-900 border-b">
              <td className="px-2 py-1 font-medium">Global (Tous)</td>
              <td className="px-2 py-1">
                <input
                  type="number"
                  min={0}
                  className="w-full h-8 px-2 rounded border text-sm"
                  placeholder="0"
                  onChange={(e) =>
                    handleGlobalInputChange("delivery_price", e.target.value)
                  }
                />
              </td>
              <td className="px-2 py-1">
                <input
                  type="number"
                  min={0}
                  className="w-full h-8 px-2 rounded border text-sm"
                  placeholder="0"
                  onChange={(e) =>
                    handleGlobalInputChange("return_price", e.target.value)
                  }
                />
              </td>
            </tr>

            {/* Wilaya Label Row */}
            <tr className="bg-gray-200 dark:bg-zinc-800">
              <td className="px-2 py-1 font-semibold" colSpan={3}>
                Wilaya
              </td>
            </tr>

            {/* Individual Commune Rows */}
            {communes.map((commune) => (
              <tr key={commune.id} className="border-b">
                <td className="px-2 py-1 truncate">{commune.commune_name}</td>
                <td className="px-2 py-1">
                  <input
                    type="number"
                    min={0}
                    className="w-full h-8 px-2 rounded border text-sm"
                    placeholder="0"
                    value={prices[commune.id]?.delivery_price ?? ""}
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
                    value={prices[commune.id]?.return_price ?? ""}
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
          {saving ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </div>

      {/* Alert Dialog */}
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
                ? "Cette action remplacera tous les champs de prix existants pour toutes les communes."
                : "Vous êtes sur le point d'enregistrer les prix. Confirmez-vous ?"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmAction}>
              Continuer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
