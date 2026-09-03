import { useState } from "react";

import TechnicianStats from "../../components/TechnicianStats/TechnicianStats";
import TechnicianTicketCard from "../../components/TechnicianTicketCard/TechnicianTicketCard";
import TicketDetailsModal from "../../components/TicketDetailModal/TicketDetailModal";

import "./TechnicianDashboard.css";

function TechnicianDashboard() {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [status, setStatus] = useState("Assigned");

  const ticket = {
    id: "FIX-001",
    title: "Water Leakage in Block A",
    description:
      "There is a water leakage problem near the first-floor washroom in Block A. Please inspect the pipe and resolve the issue.",
    category: "Plumbing",
    priority: "High",
    location: "Block A",
    reportedOn: "01 Sep 2026",
    image: null,
  };

  const handleOpenTicket = () => {
    setSelectedTicket(ticket);
    setStatus("Assigned");
  };

  const handleCloseModal = () => {
    setSelectedTicket(null);
  };

  return (
    <div className="technician-dashboard">

      
      <main className="technician-main">

        {/* =========================
            PAGE HEADER
        ========================= */}

        <header className="technician-header">

          <div>
            <p className="dashboard-label">
              TECHNICIAN
            </p>

            <h1>
              Technician Dashboard
            </h1>

            <p className="dashboard-subtitle">
              Manage your assigned issues and keep track of their progress.
            </p>
          </div>

          <div className="availability">
            <span className="availability-dot"></span>
            Available
          </div>

        </header>


        {/* =========================
            STATISTICS
        ========================= */}

        <TechnicianStats />


        {/* =========================
            ASSIGNED TICKETS
        ========================= */}

        <section className="assigned-section">

          <div className="section-header">

            <div>
              <p className="section-label">
                WORK QUEUE
              </p>

              <h2>
                Assigned Tickets
              </h2>

              <p>
                Issues currently assigned to you.
              </p>
            </div>

            <span className="ticket-count">
              1 Ticket
            </span>

          </div>


          {/* Ticket */}
          <div className="ticket-list">

            <TechnicianTicketCard
              ticket={ticket}
              onClick={handleOpenTicket}
            />

          </div>

        </section>

      </main>


      {/* =========================
          TICKET MODAL
      ========================= */}

      {selectedTicket && (
        <TicketDetailsModal
          ticket={selectedTicket}
          status={status}
          setStatus={setStatus}
          onClose={handleCloseModal}
        />
      )}

    </div>
  );
}

export default TechnicianDashboard;