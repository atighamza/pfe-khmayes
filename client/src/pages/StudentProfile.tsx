import { useEffect, useState } from "react";
import { fetchStudentProfile, updateStudentProfile } from "../api/student";
import toast from "react-hot-toast";
import { toastError, toastSuccess } from "../utils/toasts";

export default function StudentProfile() {
  const [formData, setFormData] = useState({
    name: "",
    university: "",
    degree: "",
    year: "",
    resumeUrl: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await fetchStudentProfile();
        setFormData(res.data);
      } catch {
        toastError("Failed to load profile");
      }
    };
    loadProfile();
  }, []);

  const handleChange = (e: any) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        toastError("Please upload only PDF files");
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("university", formData.university);
      formDataToSend.append("degree", formData.degree);
      formDataToSend.append("year", formData.year);
      if (selectedFile) {
        formDataToSend.append("resume", selectedFile);
      }

      await updateStudentProfile(formDataToSend);
      toastSuccess("Profile updated successfully");
    } catch (err) {
      toastError("Update failed");
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-md rounded-xl p-8 mt-10">
      <h2 className="text-3xl font-bold mb-6 text-blue-700">
        👤 Student Profile
      </h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
        <div>
          <label className="block mb-1 font-medium">Full Name</label>
          <input
            type="text"
            name="name"
            className="peer w-full border border-gray-300 px-4 py-3 rounded-xl placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">University</label>
            <input
              type="text"
              name="university"
              className="peer w-full border border-gray-300 px-4 py-3 rounded-xl placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.university}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Degree</label>
            <input
              type="text"
              name="degree"
              className="peer w-full border border-gray-300 px-4 py-3 rounded-xl placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.degree}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Year</label>
            <input
              type="text"
              name="year"
              className="peer w-full border border-gray-300 px-4 py-3 rounded-xl placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.year}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Resume (PDF only)</label>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="w-full border border-gray-300 px-4 py-3 rounded-xl"
            />
            {formData.resumeUrl && formData.resumeUrl.trim() !== "" && (
              <a
                href={`http://localhost:5000${formData.resumeUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline mt-2 inline-block"
              >
                View Current Resume
              </a>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
