import axios from "axios";

const API_URL = "http://localhost:8080/api/medicines";

export const getMedicines = async (token) => {
  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};