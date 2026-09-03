import api from "../api/axios";

// ======================================================
// GET ASSIGNED TICKETS - TECHNICIAN
// ======================================================

export const getAssignedTickets = async () => {
  const response = await api.get(
    "/tickets/technician/assigned"
  );

  return response.data;
};


// ======================================================
// GET TECHNICIAN HISTORY
// ======================================================

export const getTechnicianHistory = async () => {
  const response = await api.get(
    "/tickets/technician/history"
  );

  return response.data;
};


// ======================================================
// GET SINGLE TICKET - TECHNICIAN
// ======================================================

export const getTechnicianTicketById = async (ticketId) => {
  const response = await api.get(
    `/tickets/technician/${ticketId}`
  );

  return response.data;
};


// ======================================================
// UPDATE TICKET STATUS
// ======================================================

export const updateTicketStatus = async (
  ticketId,
  status
) => {
  const response = await api.patch(
    `/tickets/${ticketId}/status`,
    {
      status,
    }
  );

  return response.data;
};


// ======================================================
// USER - GET MY TICKETS
// ======================================================

export const getMyTickets = async () => {
  const response = await api.get(
    "/tickets/my"
  );

  return response.data;
};


// ======================================================
// USER - GET SINGLE TICKET
// ======================================================

export const getTicketById = async (ticketId) => {
  const response = await api.get(
    `/tickets/my/${ticketId}`
  );

  return response.data;
};


// ======================================================
// DELETE TICKET
// ======================================================

export const deleteTicket = async (ticketId) => {
  const response = await api.delete(
    `/tickets/my/${ticketId}`
  );

  return response.data;
};