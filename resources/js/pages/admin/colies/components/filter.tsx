import { useState, useEffect, useCallback } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Clock, ListFilter, Check, Square, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { PopoverArrow } from "@radix-ui/react-popover";
import { statusIcons } from "./statusIcons";
import { router } from "@inertiajs/react";
import { useFilters } from "@/contexts/FilterContext";

interface Status {
  id: string;
  status: string;
  backgroundColorHex: string;
  TextColorHex: string;
}

interface FilterPopoverProps {
  statuses: Status[];
  selectedFilters?: string[];
  currentSearch?: string;
}

export function FilterPopover({
  statuses,
  selectedFilters = [],
  currentSearch = "",
}: FilterPopoverProps) {
  const [selected, setSelected] = useState<string[]>(selectedFilters);
  const [isOpen, setIsOpen] = useState(false);
  const [allSelected, setAllSelected] = useState(false);
  const [searchTerm, setSearchTerm] = useState(currentSearch);
  const [internalSearch, setInternalSearch] = useState(currentSearch);
  const [filteredStatuses, setFilteredStatuses] = useState<Status[]>(statuses);

  const { search, setSearchValue } = useFilters();

  // make the search value global with the context
  useEffect(() => {
    setSearchValue(internalSearch);
  }, [internalSearch]);

  // Filter statuses based on search term
  useEffect(() => {
    const filtered = statuses.filter(status =>
      status.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStatuses(filtered);
  }, [searchTerm, statuses]);

  // Update allSelected state when selection changes
  useEffect(() => {
    setAllSelected(selected.length === statuses.length && statuses.length > 0);
  }, [selected, statuses]);

  const toggleStatus = useCallback((id: string) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  }, []);

  const toggleSelectAll = useCallback(() => {
    setSelected(allSelected ? [] : filteredStatuses.map(status => status.id));
  }, [allSelected, filteredStatuses]);

  const handleSearch = useCallback(() => {
    router.get(route('admin.colies'), {
      search: internalSearch,
      statuses: selected,
    }, {
      preserveState: true,
      preserveScroll: true,
    });
  }, [internalSearch, selected]);

  const handleApply = useCallback(() => {
    router.get(route('admin.colies'), {
      search: internalSearch,
      statuses: selected,
    }, {
      preserveState: true,
      preserveScroll: true,
      onSuccess: () => setIsOpen(false)
    });
  }, [internalSearch, selected]);

  const handleClearFilters = useCallback(() => {
    setSelected([]);
    router.get(route('admin.colies'), {
      search: internalSearch,
      statuses: [],
    }, {
      preserveState: true,
      preserveScroll: true,
    });
  }, [internalSearch]);


  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  }, [handleSearch]);

  const hasSelections = selected.length > 0;
  const hasSearch = internalSearch.length > 0;

  return (
    <div className="flex items-center gap-2 p-3 border border-b-gray-300 dark:border-b-gray-700 bg-white dark:bg-zinc-950">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Chercher ici..."
          value={internalSearch}
          onChange={(e) => setInternalSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          className="pl-9 pr-8"
        />
        {internalSearch && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-5 w-5"
            onClick={() => setInternalSearch("")}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Search Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleSearch}
        className="gap-2 border-input hover:bg-accent/50 dark:hover:bg-accent/30"
      >
        <Search className="h-4 w-4" />
        {/* <span>Rechercher</span> */}
      </Button>

      {/* Filter Popover */}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 relative border-input hover:bg-accent/50 dark:hover:bg-accent/30"
          >
            <ListFilter className="h-4 w-4" />
            {/* <span>Filtrer</span> */}
            {(hasSelections || hasSearch) && (
              <Badge
                variant="default"
                className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs flex items-center justify-center bg-primary text-primary-foreground dark:bg-primary/90"
              >
                {hasSelections ? selected.length : "S"}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>

        <PopoverContent
          align="start"
          className="w-[320px] p-0 bg-white dark:bg-zinc-900 shadow-xl dark:shadow-zinc-950 rounded-lg border border-gray-200 dark:border-zinc-800"
          sideOffset={6}
        >
          <PopoverArrow className="fill-white dark:fill-zinc-900" />

          {/* Header */}
          <div className="sticky top-0 z-20 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 px-4 py-3 space-y-3 rounded-t-lg">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-zinc-100">
              Filtrer par statut
            </h4>

            {/* Search inside popover */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un statut..."
                className="pl-9 h-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex justify-between items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSelectAll}
                className="text-xs h-8 px-2 text-primary hover:bg-primary/10"
              >
                {allSelected ? (
                  <>
                    <Square className="h-3 w-3 mr-1.5" />
                    Tout désélectionner
                  </>
                ) : (
                  <>
                    <Check className="h-3 w-3 mr-1.5" />
                    Tout sélectionner
                  </>
                )}
              </Button>
              <div className="flex gap-2">
                {hasSelections && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearFilters}
                    className="text-xs h-8 px-2 text-destructive hover:bg-destructive/10"
                  >
                    Effacer filtres
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Status List */}
          <div className="max-h-[280px] overflow-y-auto px-2 py-2">
            {filteredStatuses.length > 0 ? (
              filteredStatuses.map((status) => (
                <div
                  key={status.id}
                  className={cn(
                    "flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors mx-2 mb-1",
                    selected.includes(status.id)
                      ? "bg-blue-50 dark:bg-blue-900/30"
                      : "hover:bg-gray-50 dark:hover:bg-zinc-800/50"
                  )}
                  onClick={() => toggleStatus(status.id)}
                >
                  <Checkbox
                    checked={selected.includes(status.id)}
                    className={cn(
                      "h-4 w-4 shrink-0 border-gray-300 dark:border-zinc-600",
                      selected.includes(status.id) && "border-primary bg-primary text-primary-foreground dark:bg-primary/90 dark:border-primary/70"
                    )}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className="flex items-center gap-2 w-full min-w-0">
                    <div className="text-gray-500 dark:text-zinc-400 shrink-0">
                      {statusIcons[status.status] || <Clock className="h-3.5 w-3.5" />}
                    </div>
                    <div
                      className="text-sm px-3 py-1 rounded-full font-medium truncate"
                      style={{
                        backgroundColor: status.backgroundColorHex,
                        color: status.TextColorHex,
                      }}
                    >
                      {status.status}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-muted-foreground">
                <Search className="h-5 w-5 mb-2" />
                <p className="text-sm">Aucun statut trouvé</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 z-10 border-t border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-3 flex justify-end gap-2 rounded-b-lg">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-gray-700 dark:text-zinc-300 border-gray-300 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800"
            >
              Annuler
            </Button>
            <Button
              size="sm"
              onClick={handleApply}
              disabled={!hasSelections && !hasSearch}
              className="bg-zinc-950 hover:bg-zinc-900 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-900"
            >
              Appliquer
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
