import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useEffect, useRef } from "react"
import { Search, Barcode } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

type Colie = {
  id: string
  tracking: string
  currentStatus: string
  clientName: string
  clientPhone: string
  address: string
}

type StatusOption = {
  value: string
  label: string
}

export function useStatusSheet() {
  const [open, setOpen] = useState(false)
  const [searchInput, setSearchInput] = useState("")
  const [foundColie, setFoundColie] = useState<Colie | null>(null)
  const [newStatus, setNewStatus] = useState("")
  const [note, setNote] = useState("")
  const [searchError, setSearchError] = useState(false)
  const [searchSuccess, setSearchSuccess] = useState(false)
  const [isBarcodeMode, setIsBarcodeMode] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const statusOptions: StatusOption[] = [
    { value: "pending", label: "En attente" },
    { value: "processing", label: "En traitement" },
    { value: "shipped", label: "Expédié" },
    { value: "delivered", label: "Livré" },
    { value: "returned", label: "Retourné" },
    { value: "cancelled", label: "Annulé" },
  ]

  // Mock function to search for colie - replace with your API call
  const searchColie = async (trackingNumber: string) => {
    // Simulate API call
    return new Promise<Colie | null>((resolve) => {
      setTimeout(() => {
        if (trackingNumber === "123456") {
          resolve({
            id: "1",
            tracking: "123456",
            currentStatus: "pending",
            clientName: "Mohamed Ali",
            clientPhone: "0555123456",
            address: "Alger, Hydra"
          })
        } else {
          resolve(null)
        }
      }, 500)
    })
  }

  const handleSearch = async () => {
    if (!searchInput.trim()) return

    const colie = await searchColie(searchInput)

    if (colie) {
      setFoundColie(colie)
      setNewStatus(colie.currentStatus)
      setSearchSuccess(true)
      setTimeout(() => setSearchSuccess(false), 3000)
    } else {
      setFoundColie(null)
      setSearchError(true)
      setTimeout(() => setSearchError(false), 3000)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const handleSubmit = () => {
    if (!foundColie || !newStatus) return

    // Here you would typically call your API to update the status
    console.log("Updating status:", {
      colieId: foundColie.id,
      newStatus,
      note
    })

    // Close the sheet after submission
    setOpen(false)
  }

  const toggleBarcodeMode = () => {
    setIsBarcodeMode(!isBarcodeMode)
    if (!isBarcodeMode && inputRef.current) {
      inputRef.current.focus()
    }
  }

  useEffect(() => {
    if (open) {
      setSearchInput("")
      setFoundColie(null)
      setNewStatus("")
      setNote("")
    }
  }, [open])

  const SheetComponent = () => (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="bottom" className="w-full h-[93vh] rounded-t-2xl">
        <SheetHeader>
          <SheetTitle>Changer le statut</SheetTitle>
          <SheetDescription>
            Sélectionnez un nouveau statut pour ce colis.
          </SheetDescription>
        </SheetHeader>

        <div className="py-4 space-y-4">
          <div className="relative">
            <div className="flex items-center gap-2">
              <Input
                ref={inputRef}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isBarcodeMode ? "Scannez le code-barres" : "Rechercher par numéro de suivi"}
                className={`pr-10 ${searchError ? "bg-red-100 animate-pulse" : ""} ${searchSuccess ? "bg-green-100 animate-pulse" : ""}`}
              />
              <Button
                variant="outline"
                size="icon"
                onClick={toggleBarcodeMode}
                className={isBarcodeMode ? "bg-blue-100" : ""}
              >
                <Barcode className="h-4 w-4" />
              </Button>
            </div>
            <Button
              size="icon"
              className="absolute right-12 top-0 h-9 w-9"
              variant="ghost"
              onClick={handleSearch}
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>

          {foundColie && (
            <div className="border rounded-lg p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Numéro de suivi</Label>
                  <p className="font-medium">{foundColie.tracking}</p>
                </div>
                <div>
                  <Label>Statut actuel</Label>
                  <p className="font-medium">
                    {statusOptions.find(s => s.value === foundColie.currentStatus)?.label}
                  </p>
                </div>
                <div>
                  <Label>Client</Label>
                  <p className="font-medium">{foundColie.clientName}</p>
                </div>
                <div>
                  <Label>Téléphone</Label>
                  <p className="font-medium">{foundColie.clientPhone}</p>
                </div>
                <div className="col-span-2">
                  <Label>Adresse</Label>
                  <p className="font-medium">{foundColie.address}</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Nouveau statut</Label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un statut" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="note">Note (optionnel)</Label>
                <Textarea
                  id="note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Ajoutez une note si nécessaire..."
                />
              </div>
            </div>
          )}

          {!foundColie && searchInput && (
            <div className="text-center py-8 text-muted-foreground">
              {searchError ? (
                <p className="text-red-500">Aucun colis trouvé avec ce numéro de suivi</p>
              ) : (
                <p>Entrez un numéro de suivi pour rechercher un colis</p>
              )}
            </div>
          )}
        </div>

        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Annuler</Button>
          </SheetClose>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={!foundColie || !newStatus}
          >
            Valider le changement
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )

  return {
    open,
    openSheet: () => setOpen(true),
    closeSheet: () => setOpen(false),
    SheetComponent
  }
}
