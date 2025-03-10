import Link from "@inertiajs/react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationProps {
  paginationLinks: { url: string | null; label: string; active: boolean }[];
}

export function DataTablePagination({ paginationLinks }: PaginationProps) {
  return (
    <Pagination>
      <PaginationContent>
        {paginationLinks.map((link, index) => {
          if (!link.url) return <PaginationEllipsis key={index} />;
          return (
            <PaginationItem key={index}>
              {link.label.includes("Previous") ? (
                <PaginationPrevious href={link.url} />
              ) : link.label.includes("Next") ? (
                <PaginationNext href={link.url} />
              ) : (
                <PaginationLink href={link.url} isActive={link.active}>
                  {link.label}
                </PaginationLink>
              )}
            </PaginationItem>
          );
        })}
      </PaginationContent>
    </Pagination>
  );
}
