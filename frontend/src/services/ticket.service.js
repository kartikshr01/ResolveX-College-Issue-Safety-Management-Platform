import api from "./api";

export const createTicket = async (formData) => {
  const response = await api.post(
    "/tickets",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};


export const getMyTickets = async () => {
  const response = await api.get("/tickets/my");

  return response.data;
};


export const getMyTicketById = async (ticketId) => {
  const response = await api.get(
    `/tickets/my/${ticketId}`
  );

  return response.data;
};


export const updateTicket = async (
  ticketId,
  ticketData
) => {
  const response = await api.patch(
    `/tickets/${ticketId}`,
    ticketData
  );

  return response.data;
};


export const updateTicketImage = async (
  ticketId,
  formData
) => {
  const response = await api.patch(
    `/tickets/${ticketId}/image`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};


export const deleteTicket = async (ticketId) => {
  const response = await api.delete(
    `/tickets/my/${ticketId}`
  );

  return response.data;
};