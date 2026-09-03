import api from "../api/axios";

export const getTicketForNotification = async (ticketId) => {
  const response = await api.get(
    `/tickets/notification/${ticketId}`,
  );

  return response.data?.data;
};