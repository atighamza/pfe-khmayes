import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { updateInternship, getInternshipById } from "../api/internship";
import { toastError, toastSuccess } from "../utils/toasts";

export default function EditInternship() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState<any>(null);
  const techOptions = [
    "React",
    "Node.js",
    "Python",
    "MongoDB",
    "Docker",
    "Figma",
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const post = await getInternshipById(id!);
        setForm(post.data);
      } catch {
        toastError("Unable to load internship");
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (tech: string) => {
    setForm((prev: any) => ({
      ...prev,
      technologies: prev.technologies.includes(tech)
        ? prev.technologies.filter((t: string) => t !== tech)
        : [...prev.technologies, tech],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateInternship(id!, form);
      toastSuccess("Internship updated!");
      navigate("/company/dashboard");
    } catch {
      toastError("Update failed");
    }
  };

  useEffect(() => console.log(form), [form]);

  if (!form) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">
        ✏️ Edit Internship
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Title"
          className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
        />
        <input
          name="salary"
          value={form.salary}
          onChange={handleChange}
          placeholder="Salary"
          className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          name="numberOfInterns"
          type="number"
          value={form.numberOfInterns}
          onChange={handleChange}
          placeholder="Number of interns"
          className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          name="duration"
          value={form.duration}
          onChange={handleChange}
          placeholder="Duration (weeks)"
          className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option>Summer</option>
          <option>Final Year</option>
          <option>Gap Year</option>
        </select>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {techOptions.map((tech) => (
            <label key={tech} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form!.technologies!.includes(tech)}
                onChange={() => handleCheckboxChange(tech)}
              />
              {tech}
            </label>
          ))}
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 hover:cursor-pointer"
        >
          Update Internship
        </button>
      </form>
    </div>
  );
}
