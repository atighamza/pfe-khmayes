import axios from "axios";

const API = "http://localhost:5000/api/internships";

export const postInternship = async (data: {
  title: string;
  description: string;
  salary: string;
  numberOfInterns: number;
  technologies: string[];
  type: string;
  duration: string;
}) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No token found. Please login first.");
  }

  return axios.post(API, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

export const deleteInternship = async (id: string) => {
  const token = localStorage.getItem("token");
  return axios.delete(`http://localhost:5000/api/internships/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const fetchCompanyInternships = async (page = 1, search = "") => {
  const token = localStorage.getItem("token");
  return axios.get(
    `http://localhost:5000/api/internships/my?page=${page}&search=${search}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export const updateInternship = async (id: string, data: any) => {
  const token = localStorage.getItem("token");
  return axios.put(`http://localhost:5000/api/internships/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getInternshipById = async (id: string) => {
  const token = localStorage.getItem("token");
  return axios.get(`http://localhost:5000/api/internships/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const fetchAllInternships = async (
  page = 1,
  search = "",
  type = "",
  tech = ""
) => {
  const params = new URLSearchParams();
  params.append("page", String(page));
  if (search) params.append("search", search);
  if (type) params.append("type", type);
  if (tech) params.append("tech", tech);

  return axios.get(
    `http://localhost:5000/api/internships?${params.toString()}`
  );
};
