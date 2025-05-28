import { useEffect, useState } from "react";
import { fetchAllInternships } from "../api/internship";
import toast from "react-hot-toast";

export default function StudentBrowseInternships() {
  const [internships, setInternships] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [type, setType] = useState("");
  const [tech, setTech] = useState("");

  const limit = 6;

  const loadInternships = async () => {
    try {
      const res = await fetchAllInternships(page, search, type, tech);
      setInternships(res.data.internships);
      setTotal(res.data.total);
    } catch {
      toast.error("Failed to fetch internships");
    }
  };

  useEffect(() => {
    loadInternships();
  }, [page, search, type, tech]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput);
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 px-4 py-10">
      <h2 className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-purple-600 mb-10">
        🔍 Explore Internship Opportunities
      </h2>

      <form onSubmit={handleSearch} className="max-w-4xl mx-auto mb-8">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by title..."
            className="flex-1 px-5 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none w-full"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-xl shadow hover:bg-blue-700 transition"
          >
            Search
          </button>
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {/* Sidebar Filters */}
        <div className="bg-white rounded-2xl shadow-md p-6 h-fit sticky top-24">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            🎛 Filters
          </h3>
          <div className="space-y-4">
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value="">All Internship Types</option>
              <option value="Summer">Summer</option>
              <option value="Final Year">Final Year</option>
              <option value="Gap Year">Gap Year</option>
            </select>

            <select
              value={tech}
              onChange={(e) => setTech(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value="">All Technologies</option>
              <option value="React">React</option>
              <option value="Node.js">Node.js</option>
              <option value="Python">Python</option>
              <option value="MongoDB">MongoDB</option>
            </select>

            <button
              onClick={() => {
                setType("");
                setTech("");
                setSearch("");
                setSearchInput("");
                setPage(1);
              }}
              className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Internship List */}
        <div className="md:col-span-3 space-y-6">
          {internships.length === 0 ? (
            <p className="text-gray-500 text-lg">No internships found.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {internships.map((post: any) => (
                <div
                  key={post._id}
                  className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition"
                >
                  <h3 className="text-2xl font-semibold text-blue-700 mb-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    {post.description}
                  </p>
                  <div className="text-sm text-gray-500 space-y-1">
                    <p>
                      <strong>Company:</strong> {post.companyId?.name}
                    </p>
                    <p>
                      <strong>Type:</strong> {post.type}
                    </p>
                    <p>
                      <strong>Technologies:</strong>{" "}
                      {post.technologies.join(", ")}
                    </p>
                    <p>
                      <strong>Salary:</strong> {post.salary || "Unpaid"}
                    </p>
                    <p>
                      <strong>Duration:</strong> {post.duration} weeks
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
                  className={`px-4 py-2 rounded-full font-medium ${
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
      </div>
    </div>
  );
}
