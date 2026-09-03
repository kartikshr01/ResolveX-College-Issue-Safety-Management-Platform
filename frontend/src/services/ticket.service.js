import api from "../api/axios";

export const getAssignedTickets = async () => {
  const response = await api.get("/tickets/technician/assigned");

  return response.data;
};
export const getTechnicianHistory = async () => {
  const response = await api.get(
    "/tickets/technician/history"
  );

  return response.data;
};

export const getTicketById = async (ticketId) => {
  const response = await api.get(`/tickets/${ticketId}`);

  return response.data;
};


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

export const deleteTicket = async (ticketId) => {
  const response = await api.delete(
    `/tickets/${ticketId}`
  );

  return response.data;
};