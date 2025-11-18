import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import TicketsList from '@/components/admin/tickets/TicketsList';
import TicketDetails from '@/components/admin/tickets/TicketDetails';
import CreateTicketForm from '@/components/admin/tickets/CreateTicketForm';

/**
 * Tickets Management Page
 * Admin interface for managing support tickets, viewing conversations, and responding to users
 * Supports URL-based navigation with ?id=<ticketId> for easy sharing and bookmarking
 */
const TicketsManagement = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const ticketId = searchParams.get('id');

  const handleViewTicket = (ticketId: string) => {
    navigate(`/admin/tickets?id=${ticketId}`);
  };

  const handleBack = () => {
    navigate('/admin/tickets');
  };

  const handleCreateTicket = () => {
    setCreateModalOpen(true);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Support Tickets</h1>
      {ticketId ? (
        <TicketDetails ticketId={ticketId} onBack={handleBack} />
      ) : (
        <TicketsList
          onViewTicket={handleViewTicket}
          onCreateTicket={handleCreateTicket}
        />
      )}

      <CreateTicketForm
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />
    </div>
  );
};

export default TicketsManagement;
