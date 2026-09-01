import Sidebar from "./Sidebar";
import Header from "./Header";
import Dashboard from "../../pages/Dashboard/Dashboard";

function DashboardLayout() {
  return (
    <div className="app-layout">
      <Sidebar />

      <div className="main-area">
        <Header />

        <main className="main-content">
          <Dashboard />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;