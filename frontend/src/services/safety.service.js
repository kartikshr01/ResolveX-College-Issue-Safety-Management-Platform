import api from "./api";

export const getPublicSafetyIssues = async () => {
  const response = await api.get("/issues/public");
console.log("FRONTEND SAFETY DATA:", response.data.data);
  return response.data.data;
};