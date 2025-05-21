import {
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertTriangle, XCircle, CheckCircle2, Trash2, Search, Check } from "lucide-react"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useState } from "react"

export function StatusSheet() {

    const [selectedStatus, setSelectedStatus] = useState<string>()
    const [note, setNote] = useState("")
    const [search, setSearch] = useState("")

  return (
    <>
        {/* Header with gradient */}
        <div className="px-6 pt-6 pb-4 bg-gradient-to-br from-destructive/5 to-muted/30 border-b border-border/50">
          <SheetHeader>
            <div className="flex items-start gap-4">
              <div className="p-2.5 bg-destructive/10 rounded-xl shadow-sm">
                <AlertTriangle className="text-destructive w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <SheetTitle className="text-2xl font-bold tracking-tight text-foreground/90">
                  Mise en statut d'expédition
                </SheetTitle>
                <SheetDescription className="text-sm leading-relaxed text-muted-foreground/80">
                  <span className="font-medium text-destructive">Attention :</span> Le passage en "prêt à expédier" est irréversible et verrouille les modifications ultérieures.
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>
        </div>

        {/* Scrollable Body */}
        <ScrollArea className="flex-1 bg-white/95 h-100vh">
        <div className="px-6 py-8 space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative">

            {/* Left Column */}
            <div className="space-y-6">
                {/* Status Selector */}
                <div className="space-y-3">
                <Label className="text-base font-semibold text-foreground/90">
                    Sélection du statut
                </Label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="h-12 pl-3 text-base shadow-sm bg-background">
                    <SelectValue placeholder="Choisir un statut..." />
                    </SelectTrigger>
                    <SelectContent className="shadow-lg">
                    <SelectItem
                        value="ready"
                        className="data-[state=checked]:bg-emerald-50 hover:bg-emerald-50/50"
                    >
                        <div className="flex items-center gap-3">
                        <CheckCircle2 className="text-emerald-600 w-5 h-5" />
                        <span className="font-medium">Prêt à expédier</span>
                        </div>
                    </SelectItem>
                    <SelectItem
                        value="hold"
                        className="data-[state=checked]:bg-amber-50 hover:bg-amber-50/50"
                    >
                        <div className="flex items-center gap-3">
                        <AlertTriangle className="text-amber-600 w-5 h-5" />
                        <span className="font-medium">En attente</span>
                        </div>
                    </SelectItem>
                    <SelectItem
                        value="cancel"
                        className="data-[state=checked]:bg-red-50 hover:bg-red-50/50"
                    >
                        <div className="flex items-center gap-3">
                        <XCircle className="text-red-600 w-5 h-5" />
                        <span className="font-medium">Annulation</span>
                        </div>
                    </SelectItem>
                    </SelectContent>
                </Select>
                </div>

                {/* Note Editor */}
                <div className="space-y-3">
                <Label className="text-base font-semibold text-foreground/90">
                    Notes internes
                </Label>
                <div className="relative">
                    <Input
                    placeholder="Exemple : Demande spécifique du client..."
                    className="h-32 px-4 py-3 shadow-sm bg-background resize-none"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    />
                    <div className="absolute bottom-2 right-2 text-xs bg-background/80 px-2 py-1 rounded-full text-muted-foreground">
                    {note.length}/280
                    </div>
                </div>
                </div>
            </div>

            {/* Vertical Line Separator (only visible on large screens) */}
            <div className="hidden lg:block absolute left-1/2 top-0 h-full w-px bg-border"></div>

            {/* Right Column */}
            <div className="space-y-4">
                {/* Search Bar */}
                <div className="flex gap-2">
                <Input
                    placeholder="Rechercher un colis..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="h-12 shadow-sm bg-background"
                />
                <Button className="h-12 px-5 gap-2 shadow-sm">
                    <Check className="w-4 h-4" />
                    Valider
                </Button>
                </div>

                {/* Data Table */}
                <div className="border rounded-xl overflow-hidden shadow-sm">
                <div className="bg-muted/50 px-4 py-3 border-b">
                    <h4 className="font-semibold text-sm">Colis à modifier</h4>
                </div>
                <div className="divide-y">
                    {[1, 2, 3].map((item) => (
                    <div
                        key={item}
                        className="group flex items-center justify-between px-4 py-3 hover:bg-muted/30 transition-colors"
                    >
                        <div>
                        <p className="font-medium text-foreground/90">COLIS-00{item}</p>
                        <p className="text-sm text-muted-foreground">Créé le 0{item}/01/2024</p>
                        </div>
                        <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive/80 hover:text-destructive"
                        >
                        <Trash2 className="w-5 h-5" />
                        </Button>
                    </div>
                    ))}
                </div>
                </div>
            </div>
            </div>
        </div>
        </ScrollArea>


        {/* Sticky Footer */}
        <div className="sticky bottom-0 bg-background/95 backdrop-blur-lg border-t border-border/50">
          <div className="flex justify-end gap-3 px-6 py-4">
            <SheetClose asChild>
              <Button
                variant="outline"
                className="h-11 px-6 rounded-lg border border-border/50 shadow-sm"
              >
                Annuler
              </Button>
            </SheetClose>
            <Button
              className="h-11 px-8 rounded-lg shadow-sm bg-emerald-600 hover:bg-emerald-700"
              disabled={!selectedStatus}
            >
              Confirmer
            </Button>
          </div>
        </div>
    </>
  )
}

