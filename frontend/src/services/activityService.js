import api from "./api";

export const getMyActivity = async () => {
  const response = await api.get("/activity");

  return response.data.data;
};