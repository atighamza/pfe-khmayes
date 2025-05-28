import { useEffect, useState } from "react";
import { deleteInternship, fetchCompanyInternships } from "../api/internship";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { toastError } from "../utils/toasts";

export default function CompanyDashboard() {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");

  const limit = 6;

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetchCompanyInternships(page, search);
      setInternships(res.data.internships);
      setTotal(res.data.total);
    } catch {
      toastError("Failed to load internships");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [page, search]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this internship?")) return;
    try {
      await deleteInternship(id);
      toast.success("Deleted successfully");
      loadData();
    } catch {
      toast.error("Delete failed");
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold text-blue-700">
          📋 My Internship Posts
        </h2>
        <input
          type="text"
          placeholder="Search..."
          className="px-4 py-2 border rounded-md"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <p className="text-gray-500">Loading internships.</p>
      ) : internships.length === 0 ? (
        <p className="text-gray-500">No results.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {internships.map((post: any) => (
            <div
              key={post._id}
              className="bg-white rounded-xl p-6 shadow hover:shadow-lg transition"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-semibold text-gray-800">
                  {post.title}
                </h3>
                <div className="flex gap-2">
                  <Link
                    to={`/company/edit-internship/${post._id}`}
                    className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-200 transition"
                  >
                    ✏️ Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(post._id)}
                    className="inline-block px-4 py-1.5 bg-red-100 text-red-700 rounded-full text-sm font-medium hover:bg-red-200 transition hover:cursor-pointer"
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4">{post.description}</p>
              <div className="text-sm text-gray-500 flex flex-col gap-1">
                <span>
                  <strong>💰</strong> {post.salary || "Unpaid"}
                </span>
                <span>
                  <strong>👥</strong> {post.numberOfInterns}
                </span>
                <span>
                  <strong>🧠</strong> {post.technologies.join(", ") || "N/A"}
                </span>
                <span>
                  <strong>📅</strong> {post.duration} weeks ({post.type})
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-6">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 rounded ${
              i + 1 === page
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            } hover:bg-blue-500 hover:text-white transition`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
