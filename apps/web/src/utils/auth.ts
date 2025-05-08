import { authApi } from "@api/auth";

export const getAuthHeader = () => {
  const token = authApi.getToken();
  if (!token) {
    throw new Error("Authentication required");
  }

  return {
    Authorization: `Bearer ${token}`,
  };
};
