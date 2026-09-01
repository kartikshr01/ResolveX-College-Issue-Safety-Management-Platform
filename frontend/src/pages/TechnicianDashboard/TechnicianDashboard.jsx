import TechnicianStats from "../../components/TechnicianStats/TechnicianStats";
import TechnicianTicketCard from "../../components/TechnicianTicketCard/TechnicianTicketCard";
import './TechnicianDashboard.css'
function TechnicianDashboard() {
  return (
    <div>
      <h1>Technician Dashboard</h1>

      <p>Welcome to the technician dashboard.</p>
<TechnicianStats />
      <div>
        <h2>Assigned Tickets</h2>
 <TechnicianTicketCard />
 
        <p>No tickets assigned yet.</p>
      </div>
    </div>
  );
}

export default TechnicianDashboard;