import axios from "axios";

const API = "http://localhost:5000/api/student";

export const fetchStudentPosts = async (page = 1, search = "") => {
  const token = localStorage.getItem("token");
  return axios.get(`${API}?page=${page}&search=${search}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const fetchStudentProfile = () => {
  const token = localStorage.getItem("token");

  return axios.get(`${API}/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
export const updateStudentProfile = (data: any) => {
  const token = localStorage.getItem("token");

  return axios.put(`${API}/profile`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
