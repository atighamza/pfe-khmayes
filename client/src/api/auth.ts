import axios from "axios";

const API = "http://localhost:5000/api/auth";

export const signup = async (data: any) => {
  return axios.post(`${API}/signup`, data);
};

export const login = async (data: any) => {
  return axios.post(`${API}/login`, data);
};
