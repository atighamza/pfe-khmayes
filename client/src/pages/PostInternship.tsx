import { useState } from "react";
import { postInternship } from "../api/internship";
import { toastError, toastSuccess } from "../utils/toasts";

export default function PostInternship() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    salary: "",
    numberOfInterns: 1,
    technologies: [] as string[],
    type: "Summer",
    duration: "",
  });

  const handleCheckboxChange = (tech: string) => {
    setForm((prev) => ({
      ...prev,
      technologies: prev.technologies.includes(tech)
        ? prev.technologies.filter((t) => t !== tech)
        : [...prev.technologies, tech],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await postInternship(form);
      toastSuccess("Internship posted successfully!");
      setForm({
        title: "",
        description: "",
        salary: "",
        numberOfInterns: 1,
        technologies: [],
        type: "Summer",
        duration: "",
      });
    } catch (err) {
      toastError("Failed to post internship.");
    }
  };

  const techOptions = [
    "React",
    "Node.js",
    "Python",
    "MongoDB",
    "Docker",
    "Figma",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-purple-50 p-6 flex justify-center">
      <div className="w-full max-w-4xl bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-blue-700">
          📢 Post a New Internship
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block font-medium text-gray-700">
              Internship Title
            </label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Frontend Developer Intern"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-medium text-gray-700">
              Description
            </label>
            <textarea
              required
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              placeholder="Describe the internship role, expectations, and benefits..."
            />
          </div>

          {/* Salary and Number of Interns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-gray-700">
                Salary (Optional)
              </label>
              <input
                type="number"
                value={form.salary}
                onChange={(e) => setForm({ ...form, salary: e.target.value })}
                className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. 500 TND"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700">
                Number of Interns
              </label>
              <input
                type="number"
                min={1}
                value={form.numberOfInterns}
                onChange={(e) =>
                  setForm({
                    ...form,
                    numberOfInterns: parseInt(e.target.value),
                  })
                }
                className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Technologies Required */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Technologies Required
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {techOptions.map((tech) => (
                <label
                  key={tech}
                  className="inline-flex items-center space-x-2 text-sm text-gray-700"
                >
                  <input
                    type="checkbox"
                    checked={form.technologies.includes(tech)}
                    onChange={() => handleCheckboxChange(tech)}
                    className="accent-blue-600"
                  />
                  <span>{tech}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Type and Duration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-gray-700">
                Internship Type
              </label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>Summer</option>
                <option>Final Year</option>
                <option>Gap Year</option>
              </select>
            </div>
            <div>
              <label className="block font-medium text-gray-700">
                Duration (weeks)
              </label>
              <input
                type="number"
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: e.target.value })}
                className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. 8"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Post Internship 🚀
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
