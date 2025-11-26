import React, { useEffect, useState } from "react";
import API from "../../api/api";
import { format } from "date-fns";

const Overview = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [query, setQuery] = useState("");

  const fetchUsers = (p = page, q = query) => {
    setLoading(true);
    API.get(`/api/users/?page=${p}&per_page=${perPage}${q ? `&q=${encodeURIComponent(q)}` : ""}`)
      .then((res) => {
        const data = res.data || {};
        setUsers(data.items || []);
        setTotal(data.total || 0);
        setPage(data.page || p);
      })
      .catch((err) => {
        console.error("Failed to load users", err);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers(1, "");
  }, []);

  const onSearch = (e) => {
    e.preventDefault();
    fetchUsers(1, query);
  };

  const onDelete = (email) => {
    if (!confirm(`Hapus user ${email}?`)) return;
    API.delete(`/api/users/${encodeURIComponent(email)}`)
      .then(() => {
        fetchUsers(page, query);
      })
      .catch((err) => {
        console.error(err);
        alert("Gagal menghapus user");
      });
  };

  const totalPages = Math.max(1, Math.ceil((total || 0) / perPage));

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-2">
        <h2 className="text-base sm:text-lg font-semibold">Overview</h2>
        <div className="text-xs sm:text-sm text-gray-600">Users registered: <strong>{total}</strong></div>
      </div>

      <div className="bg-white rounded shadow p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 sm:mb-4 gap-2">
          <h3 className="font-medium text-sm sm:text-base">Users</h3>
          <form onSubmit={onSearch} className="flex items-center w-full sm:w-auto">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search email..."
              className="border px-2 py-1 rounded mr-2 text-xs sm:text-sm flex-1 sm:flex-initial"
            />
            <button className="btn btn-sm bg-gray-200 px-2 sm:px-3 py-1 rounded text-xs sm:text-sm" type="submit">Search</button>
          </form>
        </div>

        {loading ? (
          <p className="text-xs sm:text-sm">Loading...</p>
        ) : users.length === 0 ? (
          <p className="text-xs sm:text-sm text-gray-600">No registered users.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm min-w-[500px]">
              <thead>
                <tr className="text-left text-[10px] sm:text-xs text-gray-500">
                  <th className="px-2 sm:px-3 py-1.5 sm:py-2">Email</th>
                  <th className="px-2 sm:px-3 py-1.5 sm:py-2">Role</th>
                  <th className="px-2 sm:px-3 py-1.5 sm:py-2">Created At</th>
                  <th className="px-2 sm:px-3 py-1.5 sm:py-2">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.email} className="border-t">
                    <td className="px-2 sm:px-3 py-1.5 sm:py-2 align-top text-[10px] sm:text-xs">{u.email}</td>
                    <td className="px-2 sm:px-3 py-1.5 sm:py-2 align-top text-[10px] sm:text-xs">{u.role || 'user'}</td>
                    <td className="px-2 sm:px-3 py-1.5 sm:py-2 align-top text-[10px] sm:text-xs">{u.created_at ? format(new Date(u.created_at), 'dd MMM yyyy HH:mm') : '-'}</td>
                    <td className="px-2 sm:px-3 py-1.5 sm:py-2 align-top">
                      <button className="text-[10px] sm:text-sm text-red-600" onClick={() => onDelete(u.email)}>Hapus</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex flex-col sm:flex-row justify-between items-center mt-3 sm:mt-4 gap-2">
              <div className="text-xs sm:text-sm text-gray-600">Page {page} / {totalPages}</div>
              <div className="flex gap-2">
                <button disabled={page<=1} onClick={() => { const p = Math.max(1, page-1); fetchUsers(p, query); }} className="px-2 sm:px-3 py-1 border rounded text-xs sm:text-sm">Prev</button>
                <button disabled={page>=totalPages} onClick={() => { const p = Math.min(totalPages, page+1); fetchUsers(p, query); }} className="px-2 sm:px-3 py-1 border rounded text-xs sm:text-sm">Next</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Overview;
