import { useState } from "react";
import {
  FiPlus,
  FiSearch,
  FiFilter,
} from "react-icons/fi";

import technicianData from "../../data/TechnicianData";
import TechnicianTable from "../../components/Technician/TechnicianTable";
import TechnicianForm from "../../components/Technician/TechnicianForm";
import TechnicianDetails from "./TechnicianDetails";

function TechnicianList() {
  // =========================
  // STATE
  // =========================

  const [technicians, setTechnicians] =
    useState(technicianData);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [availabilityFilter, setAvailabilityFilter] =
    useState("All");

  const [showForm, setShowForm] =
    useState(false);

  const [editingTechnician, setEditingTechnician] =
    useState(null);

  const [selectedTechnician, setSelectedTechnician] =
    useState(null);

  const [deleteTechnician, setDeleteTechnician] =
    useState(null);

  const [successMessage, setSuccessMessage] =
    useState("");


  // =========================
  // SUCCESS MESSAGE
  // =========================

  const showSuccess = (message) => {
    setSuccessMessage(message);

    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  };


  // =========================
  // SEARCH + FILTER
  // =========================

  const filteredTechnicians =
    technicians.filter((technician) => {
      const searchText =
        search.trim().toLowerCase();

      const matchesSearch =
        technician.name
          .toLowerCase()
          .includes(searchText) ||
        technician.email
          .toLowerCase()
          .includes(searchText) ||
        technician.phone
          .toLowerCase()
          .includes(searchText) ||
        (technician.department || "")
          .toLowerCase()
          .includes(searchText) ||
        technician.id
          .toLowerCase()
          .includes(searchText);

      const matchesStatus =
        statusFilter === "All" ||
        technician.status === statusFilter;

      const matchesAvailability =
        availabilityFilter === "All" ||
        technician.availability ===
          availabilityFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesAvailability
      );
    });


  // =========================
  // ADD TECHNICIAN
  // =========================

  const handleAddTechnician = (formData) => {
    const nextNumber =
      technicians.length + 1;

    const newTechnician = {
      ...formData,

      id: `TECH-${String(
        nextNumber
      ).padStart(3, "0")}`,

      currentWorkload: 0,

      maxWorkload: 5,
    };

    setTechnicians((previous) => [
      ...previous,
      newTechnician,
    ]);

    setShowForm(false);

    showSuccess(
      "Technician added successfully."
    );
  };



  const handleEditTechnician = (formData) => {
    setTechnicians((previous) =>
      previous.map((technician) =>
        technician.id ===
        editingTechnician.id
          ? {
              ...technician,
              ...formData,
            }
          : technician
      )
    );

    setEditingTechnician(null);

    showSuccess(
      "Technician updated successfully."
    );
  };


  // =========================
  // DELETE TECHNICIAN
  // =========================

  const handleDeleteTechnician = () => {
    if (!deleteTechnician) {
      return;
    }

    setTechnicians((previous) =>
      previous.filter(
        (technician) =>
          technician.id !==
          deleteTechnician.id
      )
    );

    // Agar deleted technician details
    // mein selected tha to clear kar do
    if (
      selectedTechnician?.id ===
      deleteTechnician.id
    ) {
      setSelectedTechnician(null);
    }

    setDeleteTechnician(null);

    showSuccess(
      "Technician deleted successfully."
    );
  };


  // =========================
  // VIEW TECHNICIAN
  // =========================

  const handleViewTechnician = (
    technician
  ) => {
    setSelectedTechnician(technician);
  };


  // =========================
  // EDIT FROM DETAILS
  // =========================

  const handleEditFromDetails = (
    technician
  ) => {
    setSelectedTechnician(null);

    setEditingTechnician(technician);
  };


  // =========================
  // OPEN ADD FORM
  // =========================

  const openAddForm = () => {
    setEditingTechnician(null);

    setShowForm(true);
  };


  // =========================
  // CLOSE FORM
  // =========================

  const closeForm = () => {
    setShowForm(false);

    setEditingTechnician(null);
  };


  // =========================
  // VIEW DETAILS PAGE
  // =========================

  if (selectedTechnician) {
    return (
      <TechnicianDetails
        technician={selectedTechnician}
        onBack={() =>
          setSelectedTechnician(null)
        }
        onEdit={
          handleEditFromDetails
        }
      />
    );
  }


  // =========================
  // MAIN PAGE
  // =========================

  return (
    <div className="technicians-page">

      {/* =====================
          PAGE HEADER
      ====================== */}

      <div className="page-heading">

        <div>
          <h2>Technicians</h2>

          <p>
            Manage technicians,
            availability and workload.
          </p>
        </div>

        <button
          type="button"
          className="primary-btn"
          onClick={openAddForm}
        >
          <FiPlus />

          Add Technician
        </button>

      </div>


      {/* =====================
          SUCCESS MESSAGE
      ====================== */}

      {successMessage && (
        <div className="success-alert">

          <span>✓</span>

          {successMessage}

        </div>
      )}


      {/* =====================
          SEARCH + FILTER BAR
      ====================== */}

      <div className="technician-toolbar">

        {/* SEARCH */}

        <div className="technician-search">

          <FiSearch />

          <input
            type="text"
            value={search}
            placeholder="Search technicians..."
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />

        </div>


        {/* FILTERS */}

        <div className="filter-group">

          <FiFilter />


          {/* STATUS */}

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target.value
              )
            }
          >
            <option value="All">
              All Status
            </option>

            <option value="Active">
              Active
            </option>

            <option value="Inactive">
              Inactive
            </option>
          </select>


          {/* AVAILABILITY */}

          <select
            value={availabilityFilter}
            onChange={(event) =>
              setAvailabilityFilter(
                event.target.value
              )
            }
          >
            <option value="All">
              All Availability
            </option>

            <option value="Available">
              Available
            </option>

            <option value="Busy">
              Busy
            </option>

            <option value="Unavailable">
              Unavailable
            </option>
          </select>

        </div>

      </div>


      {/* =====================
          SUMMARY
      ====================== */}

      <div className="technician-summary">

        Showing{" "}

        <strong>
          {filteredTechnicians.length}
        </strong>

        {" "}of{" "}

        <strong>
          {technicians.length}
        </strong>

        {" "}technicians

      </div>


      {/* =====================
          TECHNICIAN TABLE
      ====================== */}

      {filteredTechnicians.length > 0 ? (

        <TechnicianTable
          technicians={
            filteredTechnicians
          }

          onView={
            handleViewTechnician
          }

          onEdit={(technician) => {
            setEditingTechnician(
              technician
            );

            setShowForm(false);
          }}

          onDelete={(technician) => {
            setDeleteTechnician(
              technician
            );
          }}
        />

      ) : (

        <div className="empty-technicians">

          <h3>
            No technicians found
          </h3>

          <p>
            Try changing your search
            or filters.
          </p>

          {(search ||
            statusFilter !== "All" ||
            availabilityFilter !==
              "All") && (

            <button
              type="button"
              className="secondary-btn"
              onClick={() => {
                setSearch("");

                setStatusFilter("All");

                setAvailabilityFilter(
                  "All"
                );
              }}
            >
              Clear Filters
            </button>

          )}

        </div>

      )}


      {/* =====================
          ADD / EDIT FORM
      ====================== */}

      {(showForm ||
        editingTechnician) && (

        <TechnicianForm
          technician={
            editingTechnician
          }

          onClose={closeForm}

          onSubmit={
            editingTechnician
              ? handleEditTechnician
              : handleAddTechnician
          }
        />

      )}


      {/* =====================
          DELETE CONFIRMATION
      ====================== */}

      {deleteTechnician && (

        <div className="modal-overlay">

          <div className="confirm-modal">

            <div className="confirm-icon">
              !
            </div>

            <h3>
              Delete Technician?
            </h3>

            <p>
              Are you sure you want to
              delete{" "}

              <strong>
                {deleteTechnician.name}
              </strong>
              ?
            </p>

            <p className="delete-warning">
              This action cannot be
              undone.
            </p>


            <div className="confirm-actions">

              <button
                type="button"
                className="secondary-btn"
                onClick={() =>
                  setDeleteTechnician(
                    null
                  )
                }
              >
                Cancel
              </button>


              <button
                type="button"
                className="danger-btn"
                onClick={
                  handleDeleteTechnician
                }
              >
                Delete Technician
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default TechnicianList;