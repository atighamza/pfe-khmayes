import { useEffect, useState } from "react";
import { fetchStudentPosts } from "../api/student";
import toast from "react-hot-toast";

export default function CompanyViewStudentPosts() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 6;

  const loadPosts = async () => {
    try {
      const res = await fetchStudentPosts(page, search);
      setPosts(res.data.posts);
      setTotal(res.data.total);
    } catch {
      toast.error("Failed to fetch student posts");
    }
  };

  useEffect(() => {
    loadPosts();
  }, [page, search]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput);
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-blue-700">
          🎓 Students Looking for Internships
        </h2>
        <form onSubmit={handleSearch} className="flex gap-2 mt-4 sm:mt-0">
          <input
            type="text"
            placeholder="Search by title..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="px-4 py-2 border rounded-md"
          />
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Search
          </button>
        </form>
      </div>

      {posts.length === 0 ? (
        <p className="text-gray-500 text-lg">No student posts found.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post: any) => (
            <div
              key={post._id}
              className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-semibold text-gray-800">
                  {post.internshipId?.title || "Untitled Internship"}
                </h3>
                <span
                  className={`px-2 py-1 rounded text-sm ${
                    post.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : post.status === "accepted"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {post.status || "pending"}
                </span>
              </div>
              <div className="text-sm text-gray-500">
                <p>
                  <strong>Student:</strong> {post.studentId?.name} (
                  <a
                    href={`mailto:${post.studentId?.email}`}
                    className="text-blue-500 underline"
                  >
                    {post.studentId?.email}
                  </a>
                  )
                </p>
                {post.note && (
                  <p className="mt-2">
                    <strong>Note:</strong> {post.note}
                  </p>
                )}
                <p className="mt-2 text-xs text-gray-400">
                  Applied on: {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
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
      )}
    </div>
  );
}
