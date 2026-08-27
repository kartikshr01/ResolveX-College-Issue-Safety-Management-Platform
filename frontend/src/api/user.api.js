import api from "./axios";

export const getMyProfile = () => {
  return api.get("/users/me");
};

export const updateMyProfile = (data) => {
  return api.patch("/users/me", data);
};

export const changePassword = (data) => {
  return api.patch("/users/change-password", data);
};