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
export const updateStudentProfile = (formData: FormData) => {
  const token = localStorage.getItem("token");

  return axios.put(`${API}/profile`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
};
export const updateApplicationStatus = (id, status) => {
  const token = localStorage.getItem("token");
  return axios.put(
    `${API}/${id}/status`,
    { status },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
export const deleteStudentApplication = (id: string) => {
  const token = localStorage.getItem("token");
  return axios.delete(`http://localhost:5000/api/student/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
