
import { 
  Pagination, 
  PaginationContent, 
  PaginationEllipsis, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";

interface ClassesPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const ClassesPagination = ({ currentPage, totalPages, onPageChange }: ClassesPaginationProps) => {
  if (totalPages <= 1) return null;
  
  return (
    <Pagination className="my-8">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious 
            onClick={() => onPageChange(Math.max(1, currentPage - 1))} 
            className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
          />
        </PaginationItem>
        
        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
          if (totalPages <= 5) {
            return (
              <PaginationItem key={i}>
                <PaginationLink 
                  isActive={currentPage === i + 1}
                  onClick={() => onPageChange(i + 1)}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            );
          } else {
            if (currentPage <= 3) {
              if (i < 4) {
                return (
                  <PaginationItem key={i}>
                    <PaginationLink 
                      isActive={currentPage === i + 1}
                      onClick={() => onPageChange(i + 1)}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                );
              } else {
                return (
                  <PaginationItem key="ellipsis-end">
                    <PaginationEllipsis />
                  </PaginationItem>
                );
              }
            } else if (currentPage > totalPages - 3) {
              if (i === 0) {
                return (
                  <PaginationItem key="ellipsis-start">
                    <PaginationEllipsis />
                  </PaginationItem>
                );
              } else {
                return (
                  <PaginationItem key={totalPages - 4 + i}>
                    <PaginationLink 
                      isActive={currentPage === totalPages - 4 + i}
                      onClick={() => onPageChange(totalPages - 4 + i)}
                    >
                      {totalPages - 4 + i}
                    </PaginationLink>
                  </PaginationItem>
                );
              }
            } else {
              if (i === 0) {
                return (
                  <PaginationItem key="ellipsis-start">
                    <PaginationEllipsis />
                  </PaginationItem>
                );
              } else if (i === 4) {
                return (
                  <PaginationItem key="ellipsis-end">
                    <PaginationEllipsis />
                  </PaginationItem>
                );
              } else {
                return (
                  <PaginationItem key={currentPage - 2 + i}>
                    <PaginationLink 
                      isActive={i === 2}
                      onClick={() => onPageChange(currentPage - 2 + i)}
                    >
                      {currentPage - 2 + i}
                    </PaginationLink>
                  </PaginationItem>
                );
              }
            }
          }
        })}
        
        <PaginationItem>
          <PaginationNext 
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default ClassesPagination;
