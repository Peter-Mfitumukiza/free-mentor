import React, { useEffect, useState } from "react";
import { useAuth, UserRole } from "../../contexts/AuthContext";
import { getAllUsers, changeUserRole } from "../../api/graphqlApi";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  bio?: string;
  expertise?: string;
  occupation?: string;
}

const AdminPanel: React.FC = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      fetchUsers();
    }
  }, [token]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      console.log("Fetching all users");
      const usersData = await getAllUsers(token!);
      setUsers(usersData);
    } catch (err) {
      setError("Failed to load users. Please try again later.");
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (email: string, newRole: string) => {
    try {
      setActionInProgress(email);
      console.log(`Changing role for ${email} to ${newRole}`);
      const result = await changeUserRole(email, newRole, token!);

      if (result.success) {
        // Update local state
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.email === email ? { ...user, role: newRole } : user
          )
        );
      } else {
        setError(result.message || "Failed to change user role");
      }
    } catch (err) {
      console.error("Error changing role:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setActionInProgress(null);
    }
  };

  // Filter users based on search term and role
  const filteredUsers = React.useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        searchTerm === "" ||
        `${user.firstName} ${user.lastName}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole = roleFilter === "" || user.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, searchTerm, roleFilter]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
        <p className="text-gray-600">Manage users and permissions</p>
      </header>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-md">
          {error}
          <button
            className="ml-2 text-red-700 hover:text-red-900"
            onClick={() => setError(null)}
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search users by name or email..."
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="w-full md:w-48">
          <select
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="">All Roles</option>
            <option value="USER">USER</option>
            <option value="MENTOR">MENTOR</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </div>

        <button
          onClick={fetchUsers}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
        >
          Refresh
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Email
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Role
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">
                      {user.firstName} {user.lastName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${
                        user.role === "ADMIN"
                          ? "bg-purple-100 text-purple-800"
                          : user.role === "MENTOR"
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <select
                      className="mr-3 p-1 border border-gray-300 rounded"
                      value=""
                      onChange={(e) => {
                        if (e.target.value) {
                          handleRoleChange(user.email, e.target.value);
                          e.target.value = "";
                        }
                      }}
                      disabled={actionInProgress === user.email}
                    >
                      <option value="">Change role</option>
                      {Object.values(UserRole).map(
                        (role) =>
                          role !== user.role && (
                            <option key={role} value={role}>
                              {role}
                            </option>
                          )
                      )}
                    </select>
                    {actionInProgress === user.email && (
                      <span className="text-sm text-gray-500">
                        Processing...
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No users match your search criteria.</p>
          <button
            onClick={() => {
              setSearchTerm("");
              setRoleFilter("");
            }}
            className="mt-4 text-blue-500 hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
