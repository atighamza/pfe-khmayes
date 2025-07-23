import axios from "axios";

const API = "http://localhost:5000/api/internships";

export const checkApplicationStatus = (internshipId: string) => {
  const token = localStorage.getItem("token");
  return axios.get(`${API}/${internshipId}/application-status`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const applyForInternship = (internshipId: string) => {
  const token = localStorage.getItem("token");
  return axios.post(
    `${API}/${internshipId}/apply`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};
