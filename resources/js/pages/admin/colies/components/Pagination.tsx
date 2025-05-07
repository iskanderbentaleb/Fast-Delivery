import { router } from "@inertiajs/react";
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
  if (paginationLinks.length === 0) return null;

  const handlePageChange = (url: string | null) => {
    if (url) {
      router.visit(url, {
        only: ["colies"], // Changed from "livreurs" to "colies"
        preserveScroll: true,
        preserveState: true,
      });
    }
  };

  const numericLinks = paginationLinks.filter(
    (link) => !isNaN(Number(link.label))
  );

  const totalPages = numericLinks.length;
  const currentPage = numericLinks.find((link) => link.active);
  const currentPageNumber = currentPage ? Number(currentPage.label) : 1;

  const visiblePages: (typeof numericLinks[number] | "ellipsis")[] = [];
  const sidePages = 1;

  for (let i = 0; i < totalPages; i++) {
    const pageNumber = Number(numericLinks[i].label);

    if (
      pageNumber === 1 ||
      pageNumber === totalPages ||
      (pageNumber >= currentPageNumber - sidePages &&
        pageNumber <= currentPageNumber + sidePages)
    ) {
      visiblePages.push(numericLinks[i]);
    } else if (visiblePages[visiblePages.length - 1] !== "ellipsis") {
      visiblePages.push("ellipsis");
    }
  }

  return (
    <Pagination className="text-sm md:text-base">
      <PaginationContent className="flex flex-wrap justify-center gap-1 sm:gap-2">
        {paginationLinks.find((link) => link.label.includes("Previous"))?.url && (
          <PaginationItem className="hidden sm:flex">
            <PaginationPrevious
              onClick={() =>
                handlePageChange(
                  paginationLinks.find((link) => link.label.includes("Previous"))!.url
                )
              }
              className="px-2 py-1 text-xs sm:text-sm"
            />
          </PaginationItem>
        )}

        {visiblePages.map((link, index) =>
          link === "ellipsis" ? (
            <PaginationEllipsis key={index} className="text-xs sm:text-sm" />
          ) : (
            <PaginationItem key={index}>
              <PaginationLink
                onClick={() => handlePageChange(link.url)}
                isActive={link.active}
                className="px-2 py-1 text-xs sm:text-sm"
              >
                {link.label}
              </PaginationLink>
            </PaginationItem>
          )
        )}

        {paginationLinks.find((link) => link.label.includes("Next"))?.url && (
          <PaginationItem className="hidden sm:flex">
            <PaginationNext
              onClick={() =>
                handlePageChange(
                  paginationLinks.find((link) => link.label.includes("Next"))!.url
                )
              }
              className="px-2 py-1 text-xs sm:text-sm"
            />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}
