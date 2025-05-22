import { SheetHeader, SheetTitle, SheetDescription, SheetClose } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertTriangle, XCircle, CheckCircle2, Trash2, PackageIcon } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { useState } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface Package {
  id: string;
  status: string;
  note: string;
}

interface Status {
  id: string;
  status: string;
  backgroundColorHex: string;
  TextColorHex: string;
}

interface StatusSheetProps {
  statuses: Status[];
}

export function StatusSheet({ statuses }: StatusSheetProps) {
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [note, setNote] = useState('');
  const [search, setSearch] = useState('');
  const [packages, setPackages] = useState<Package[]>([]);
  const [error, setError] = useState('');

  const playSound = (src: string) => {
    const audio = new Audio(src);
    audio.play();
  };


  const validatePackage = (): string | null => {
    if (!selectedStatus) {
      playSound('/sounds/error.mp3');
      return 'Veuillez sélectionner un statut';
    }

    if (!search.trim()) {
      playSound('/sounds/error.mp3');
      return 'Veuillez entrer un numéro de suivi';
    }

    if (!/^#COLIS-\d{5}$/.test(search)) {
      playSound('/sounds/error.mp3');
      return 'Format invalide (ex: #COLIS-12345)';
    }

    if (packages.some(pkg => pkg.id === search)) {
      playSound('/sounds/error.mp3');
      return 'Ce colis est déjà dans la liste';
    }

    return null;
  };

  const handleAddPackage = () => {
    const validationError = validatePackage();
    if (validationError) return setError(validationError);

    setPackages(prev => [{
      id: search,
      status: selectedStatus,
      note: note
    }, ...prev]);

    playSound('/sounds/success.wav');
    setSearch('');
    setError('');
    setNote('');
  };

  const handleRemovePackage = (pkgId: string) => {
    setPackages(prev => prev.filter(item => item.id !== pkgId));
  };

  const handlePackageStatusChange = (pkgId: string, newStatus: string) => {
    setPackages(prev => prev.map(pkg =>
      pkg.id === pkgId ? { ...pkg, status: newStatus } : pkg
    ));
  };

  const handlePackageNoteChange = (pkgId: string, newNote: string) => {
    setPackages(prev => prev.map(pkg =>
      pkg.id === pkgId ? { ...pkg, note: newNote } : pkg
    ));
  };

  return (
    <>
      <div className="px-6 pt-8 pb-6 bg-gradient-to-b from-destructive/10 to-transparent border-b border-border/30">
        <SheetHeader>
          <div className="flex items-start gap-3 animate-fade-in">
            <div className="p-3 bg-destructive/15 rounded-xl shadow-inner backdrop-blur-sm">
              <AlertTriangle className="text-destructive w-7 h-7 animate-pulse-slow" />
            </div>
            <div className="space-y-2.5">
              <SheetTitle className="text-3xl font-extrabold tracking-tight text-foreground/95 bg-gradient-to-r from-foreground/90 to-foreground/70 bg-clip-text text-transparent">
                Gestion des Statuts
              </SheetTitle>
              <SheetDescription className="text-sm leading-relaxed text-muted-foreground/90 max-w-2xl">
                <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-destructive/10 text-destructive rounded-md">
                  <AlertTriangle className="w-4 h-4" />
                  <strong>Action critique:</strong> Le statut « Prêt à expédier » est permanent
                </span>
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>
      </div>

        <div className="px-6 py-8 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative">
            <div className="space-y-6">
              <StatusSelect
                statuses={statuses}
                value={selectedStatus}
                onValueChange={setSelectedStatus}
              />

              <NoteInput note={note} onNoteChange={setNote} />

              <PackageSearch
                search={search}
                error={error}
                onSearchChange={setSearch}
                onAddPackage={handleAddPackage}
                selectedStatus={selectedStatus}
                setError={setError}
              />
            </div>

            <div className="hidden lg:block absolute left-1/2 top-0 h-full w-px bg-border/20" />

            <div className="space-y-5">
              <div className="space-y-4">
                <SectionLabel number={4} label="Gestion des colis" icon={<PackageIcon className="w-5 h-8" />} />
                <div className="max-h-[400px] overflow-y-auto pr-1">
                  <PackageList
                    packages={packages}
                    statuses={statuses}
                    onRemove={handleRemovePackage}
                    onStatusChange={handlePackageStatusChange}
                    onNoteChange={handlePackageNoteChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

      <div className="sticky bottom-0 bg-background/90 backdrop-blur-xl border-t border-border/30 shadow-top-lg">
        <div className="flex justify-end gap-3 px-6 py-4">
          <SheetClose asChild>
            <Button variant="outline" className="h-12 px-7 rounded-xl border border-border/40 bg-background/80 hover:bg-muted/50 gap-2">
              <XCircle className="w-5 h-5" />
              Annuler
            </Button>
          </SheetClose>
          <Button
            className="h-12 px-8 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 shadow-lg hover:shadow-emerald-500/20 transition-all"
            disabled={packages.length === 0}
          >
            <CheckCircle2 className="w-5 h-5 mr-2" />
            Confirmer les modifications
          </Button>
        </div>
      </div>
    </>
  )
}

// Extracted Components
function StatusSelect({ statuses, value, onValueChange }: {
  statuses: Status[]
  value: string
  onValueChange: (value: string) => void
}) {
  return (
    <div className="space-y-4">
      <SectionLabel number={1} label="Sélection du statut" />
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="h-12">
          <SelectValue placeholder="Sélectionner un statut" />
        </SelectTrigger>
        <SelectContent className="ml-5">
          {statuses.map((status) => (
            <SelectItem key={status.id} value={status.id} className="text-sm px-4 py-3" >
              <div className="ml-4">{status.status}</div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

function NoteInput({ note, onNoteChange }: {
  note: string
  onNoteChange: (value: string) => void
}) {
  return (
    <div className="space-y-4">
      <SectionLabel number={2} label="Notes internes" />
      <div className="relative shadow-inner rounded-lg border border-border/30 bg-background/95 backdrop-blur-sm">
        <textarea
          placeholder="Exemple : Instructions spéciales pour la livraison..."
          className="w-full h-32 px-4 py-3 resize-none border-none bg-transparent focus:ring-0"
          value={note}
          maxLength={280}
          onChange={(e) => onNoteChange(e.target.value)}
        />
        <div className="absolute bottom-3 right-3 text-xs bg-background/90 px-2.5 py-1 rounded-full text-muted-foreground border border-border/30 shadow-sm">
          {note.length}/280
        </div>
      </div>
    </div>
  )
}

function PackageSearch({ search, error, onSearchChange, onAddPackage, selectedStatus, setError }: {
  search: string
  error: string
  selectedStatus: string
  onSearchChange: (value: string) => void
  onAddPackage: () => void
  setError: (error: string) => void
}) {
  return (
    <div className="space-y-4">
      <SectionLabel number={3} label="Ajouter à la liste" />
      <div className="space-y-2">
        <div className="flex gap-2 shadow-inner rounded-lg bg-background/95 backdrop-blur-sm border border-border/30 p-1">
          <Input
            placeholder="Rechercher un colis (#COLIS-12345)"
            value={search}
            onChange={(e) => {
              onSearchChange(e.target.value);
              setError('');
            }}
            onKeyDown={(e) => e.key === 'Enter' && onAddPackage()}
            className="h-12 border-none bg-transparent shadow-none"
          />
          <Button
            onClick={onAddPackage}
            className="h-12 px-8 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 shadow-lg hover:shadow-emerald-500/20 transition-all"
            disabled={!search.trim() || !selectedStatus}
          >
            Ajouter
          </Button>
        </div>
        {error && <ErrorMessage message={error} />}
      </div>
    </div>
  )
}

function PackageList({ packages, statuses, onRemove, onStatusChange, onNoteChange }: {
  packages: Package[]
  statuses: Status[]
  onRemove: (id: string) => void
  onStatusChange: (id: string, status: string) => void
  onNoteChange: (id: string, note: string) => void
}) {
  return (
    <div className="border border-border/30 rounded-xl overflow-hidden shadow-sm bg-background/95 backdrop-blur-sm">
      <div className="bg-muted/20 px-4 py-3 border-b border-border/30">
        <h4 className="font-semibold text-sm flex items-center gap-2">
          <PackageIcon className="w-5 h-5" />
          Colis sélectionnés ({packages.length})
        </h4>
      </div>
      <div className="divide-y divide-border/30">
        {packages.length > 0 ? (
          <Accordion type="multiple" className="w-full">
            {packages.map((pkg) => (
              <PackageAccordionItem
                key={pkg.id}
                pkg={pkg}
                statuses={statuses}
                onRemove={onRemove}
                onStatusChange={onStatusChange}
                onNoteChange={onNoteChange}
              />
            ))}
          </Accordion>
        ) : (
          <div className="px-4 py-6 text-center text-muted-foreground">
            Aucun colis sélectionné
          </div>
        )}
      </div>
    </div>
  )
}

function PackageAccordionItem({ pkg, statuses, onRemove, onStatusChange, onNoteChange }: {
  pkg: Package
  statuses: Status[]
  onRemove: (id: string) => void
  onStatusChange: (id: string, status: string) => void
  onNoteChange: (id: string, note: string) => void
}) {
  const status = statuses.find(s => s.id === pkg.status);

  return (
    <AccordionItem value={pkg.id} className="border-b-0">
      <div className="p-4 group hover:bg-muted/10 transition-colors">
        <div className="flex justify-between items-center">
          <AccordionTrigger className="hover:no-underline p-0 [&[data-state=open]>div>svg]:rotate-180">
            <div className="flex items-center gap-3 flex-1">
              {status && <StatusIndicator status={status} />}
              <p className="font-medium text-foreground/90 text-left">
                <span className="text-emerald-600">{pkg.id}</span>
              </p>
              {status && <StatusBadge status={status} />}
            </div>
          </AccordionTrigger>
          <Button
            onClick={() => onRemove(pkg.id)}
            variant="ghost"
            size="icon"
            className="text-destructive/80 hover:text-destructive hover:bg-destructive/10 rounded-xl ml-2"
          >
            <Trash2 className="w-5 h-5" />
          </Button>
        </div>
        <AccordionContent className="pt-3 px-0 pb-0">
          <div className="space-y-3 p-5">
            <Select
              value={pkg.status}
              onValueChange={(value) => onStatusChange(pkg.id, value)}
            >
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Statut non défini" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((status) => (
                  <SelectItem
                    key={status.id}
                    value={status.id}
                    className="text-sm px-4 py-2"
                  >
                    <div className="ml-5">{status.status}</div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <NoteField
              note={pkg.note}
              onChange={(value) => onNoteChange(pkg.id, value)}
            />
          </div>
        </AccordionContent>
      </div>
    </AccordionItem>
  )
}

// Helper Components
function SectionLabel({ number, label, icon }: {
  number: number
  label: string
  icon?: React.ReactNode
}) {
  return (
    <Label className="text-base font-semibold text-foreground/90 flex items-center gap-2">
      <span className="bg-foreground/5 px-2 py-1 rounded-md">{number}</span>
      {label}
      {icon && icon}
    </Label>
  )
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <p className="text-destructive text-sm flex items-center gap-2 ml-2">
      <XCircle className="w-4 h-4" />
      {message}
    </p>
  )
}

function StatusIndicator({ status }: { status: Status }) {
  return (
    <div
      className="w-3 h-3 rounded-full flex-shrink-0"
      style={{ backgroundColor: status.backgroundColorHex }}
    />
  )
}

function StatusBadge({ status }: { status: Status }) {
  return (
    <span
      className="text-xs px-2 py-1 rounded-full ml-2"
      style={{
        backgroundColor: status.backgroundColorHex,
        color: status.TextColorHex
      }}
    >
      {status.status}
    </span>
  )
}

function NoteField({ note, onChange }: {
  note: string
  onChange: (value: string) => void
}) {
  return (
    <div className="relative">
      <textarea
        placeholder="Notes pour ce colis..."
        className="w-full h-20 px-3 py-2 text-sm rounded-lg border border-border/30 bg-background/80"
        value={note}
        maxLength={280}
        onChange={(e) => onChange(e.target.value)}
      />
      <div className="absolute bottom-2 right-2 text-xs bg-background/90 px-2 py-0.5 rounded-full text-muted-foreground border border-border/30 shadow-sm">
        {note.length}/280
      </div>
    </div>
  )
}
