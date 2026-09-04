import { useEffect, useState } from "react";

import TechnicianStats from "../../../components/TechnicianStats/TechnicianStats";
import TechnicianTicketCard from "../../../components/TechnicianTicketCard/TechnicianTicketCard";
import TicketDetailModal from "../../../components/TicketDetailModal/TicketDetailModal";

import { getAssignedTickets } from "../../../services/ticket.service";

import "./TechnicianDashboard.css";

function TechnicianDashboard() {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [status, setStatus] = useState("ASSIGNED");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTickets = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getAssignedTickets();

        console.log("ASSIGNED TICKETS:", response);

        setTickets(response.data || []);
      } catch (error) {
        console.error("TICKET FETCH ERROR:", error);

        setError(
          error.response?.data?.message ||
            error.message ||
            "Failed to fetch assigned tickets"
        );
      } finally {
        setLoading(false);
      }
    };

    loadTickets();
  }, []);

  const handleOpenTicket = (ticket) => {
    setSelectedTicket(ticket);
    setStatus(ticket.status);
  };

  const handleCloseModal = () => {
    setSelectedTicket(null);
  };

  const handleStatusChanged = (newStatus) => {
    setStatus(newStatus);

    setTickets((previousTickets) =>
      previousTickets.map((ticket) =>
        ticket._id === selectedTicket?._id
          ? {
              ...ticket,
              status: newStatus,
            }
          : ticket
      )
    );

    setSelectedTicket((previousTicket) =>
      previousTicket
        ? {
            ...previousTicket,
            status: newStatus,
          }
        : null
    );
  };

  return (
    <div className="technician-dashboard">
      <main className="technician-main">

        {/* HEADER */}

        <header className="technician-header">
          <div>
            <p className="dashboard-label">
              TECHNICIAN
            </p>

            <h1>
              Technician Dashboard
            </h1>

            <p className="dashboard-subtitle">
              Manage your assigned issues and keep track
              of their progress.
            </p>
          </div>

          <div className="availability">
            <span className="availability-dot"></span>
            Available
          </div>
        </header>


        {/* STATS */}

        <TechnicianStats tickets={tickets} />


        {/* ASSIGNED TICKETS */}

        <section className="assigned-section">

          <div className="section-header">
            <div>
              <p className="section-label">
                WORK QUEUE
              </p>

              <h2>
                Assigned Tickets
              </h2>

              <p className="section-description">
                Issues currently assigned to you.
              </p>
            </div>

            <span className="ticket-count">
              {tickets.length}{" "}
              {tickets.length === 1
                ? "Ticket"
                : "Tickets"}
            </span>
          </div>


          {/* LOADING */}

          {loading && (
            <div className="ticket-list-message">
              <p>Loading tickets...</p>
            </div>
          )}


          {/* ERROR */}

          {!loading && error && (
            <div className="ticket-list-message error-message">
              <p>{error}</p>
            </div>
          )}


          {/* EMPTY */}

          {!loading &&
            !error &&
            tickets.length === 0 && (
              <div className="ticket-list-message">
                <p>No tickets assigned.</p>
              </div>
            )}


          {/* TICKETS */}

          {!loading &&
            !error &&
            tickets.length > 0 && (
              <div className="ticket-list">

                {tickets.map((ticket) => (
                  <TechnicianTicketCard
                    key={ticket._id}
                    ticket={ticket}
                    onClick={() =>
                      handleOpenTicket(ticket)
                    }
                  />
                ))}

              </div>
            )}

        </section>

      </main>


      {/* TICKET MODAL */}

      {selectedTicket && (
        <TicketDetailModal
          ticket={selectedTicket}
          status={status}
          setStatus={handleStatusChanged}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

export default TechnicianDashboard;