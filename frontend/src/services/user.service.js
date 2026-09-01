import api from "../api/axios";

export const getMyProfile = async () => {
  const response = await api.get("/users/me");

  return response.data;
};

export const updateMyProfile = async (userData) => {
  const response = await api.patch("/users/me", userData);

  return response.data;
};

export const changePassword = async (passwordData) => {
  const response = await api.patch(
    "/users/change-password",
    passwordData
  );

  return response.data;
};