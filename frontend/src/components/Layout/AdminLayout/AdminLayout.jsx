import { Outlet } from "react-router-dom";
import Sidebar from "../../admin/Sidebar";
import AdminNavbar from "../../admin/AdminNavbar";

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <Sidebar />

      <div className="admin-main">
        <AdminNavbar />

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;