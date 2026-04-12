"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Search,
  Trash2,
  ShieldCheck,
  ToggleLeft,
  ToggleRight,
  ChevronDown,
  ArrowUpDown,
} from "lucide-react";
import { toast } from "sonner";
import {
  useGetAllUsersQuery,
  useDeleteUserMutation,
  useToggleUserStatusMutation,
  useUpdateUserRoleMutation,
} from "@/redux/api/adminApi";
import { Pagination } from "@/components/ui/Pagination";

const ROLES = ["BUYER", "SELLER", "AGENT", "ADMIN", "SUPER_ADMIN"];

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [filters, setFilters] = useState({
    sortBy: "createdAt",
    sortOrder: "desc" as "asc" | "desc",
  });

  const { data, isLoading, isError } = useGetAllUsersQuery({
    searchTerm: search,
    sortBy: filters.sortBy,
    sortOrder: filters.sortOrder,
    page,
    limit,
  });
  const [deleteUser] = useDeleteUserMutation();
  const [toggleStatus] = useToggleUserStatusMutation();
  const [updateRole] = useUpdateUserRoleMutation();

  const users: {
    id: string;
    name: string;
    email: string;
    role: string;
    status?: string;
    createdAt: string;
  }[] = data?.data ?? [];

  const pagination = {
    total: data?.meta?.total ?? users.length,
    limit: data?.meta?.limit, // Use frontend limit instead of backend limit
    page: data?.meta?.page ?? 1,
    totalPages: data?.meta?.totalPages,
  };

  const handleDelete = async (userId: string) => {
    if (!confirm("Delete this user permanently?")) return;
    try {
      await deleteUser(userId).unwrap();
      toast.success("User deleted.");
    } catch {
      toast.error("Failed to delete user.");
    }
  };

  const handleToggle = async (userId: string) => {
    try {
      await toggleStatus(userId).unwrap();
      toast.success("User status updated.");
    } catch {
      toast.error("Failed to toggle status.");
    }
  };

  const handleRoleChange = async (userId: string, role: string) => {
    try {
      await updateRole({ userId, role }).unwrap();
      toast.success("Role updated.");
      setEditingRoleId(null);
    } catch {
      toast.error("Failed to update role.");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2 rounded-xl bg-blue-100">
            <Users className="h-6 w-6 text-blue-600" />
          </div>
          <h1 className="text-3xl font-heading font-bold text-foreground">
            User Management
          </h1>
        </div>
        <p className="text-muted-foreground mt-1 ml-1">
          View, moderate, and manage all platform users.
        </p>
      </motion.div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setFilters((prev) => ({ ...prev, page: 1 }));
            }}
            placeholder="Search by name or email…"
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-luxury-gold/50"
          />
        </div>

        <div className="flex gap-2">
          <select
            value={filters.sortBy}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                sortBy: e.target.value,
                page: 1,
              }))
            }
            className="px-4 py-3 rounded-2xl bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-luxury-gold/50"
          >
            <option value="createdAt">Sort by Date</option>
            <option value="name">Sort by Name</option>
            <option value="email">Sort by Email</option>
            <option value="role">Sort by Role</option>
          </select>

          <button
            onClick={() =>
              setFilters((prev) => ({
                ...prev,
                sortOrder: prev.sortOrder === "asc" ? "desc" : "asc",
                page: 1,
              }))
            }
            className="px-4 py-3 rounded-2xl bg-card border border-border text-sm hover:bg-muted/50 transition-colors flex items-center gap-2"
          >
            <ArrowUpDown className="h-4 w-4" />
            {filters.sortOrder === "asc" ? "A-Z" : "Z-A"}
          </button>
        </div>
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-3xl bg-card border border-border shadow-sm overflow-hidden"
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-8 h-8 border-4 border-luxury-gold border-t-transparent rounded-full animate-spin" />
          </div>
        ) : isError ? (
          <div className="flex items-center justify-center h-48 text-muted-foreground">
            Failed to load users.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left px-6 py-4 font-semibold text-muted-foreground">
                    Name
                  </th>
                  <th className="text-left px-6 py-4 font-semibold text-muted-foreground">
                    Email
                  </th>
                  <th className="text-left px-6 py-4 font-semibold text-muted-foreground">
                    Role
                  </th>
                  <th className="text-left px-6 py-4 font-semibold text-muted-foreground">
                    Status
                  </th>
                  <th className="text-left px-6 py-4 font-semibold text-muted-foreground">
                    Joined
                  </th>
                  <th className="text-right px-6 py-4 font-semibold text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center py-12 text-muted-foreground"
                    >
                      No users found.
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-muted/10 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-luxury-gold/10 flex items-center justify-center font-bold text-luxury-gold text-sm">
                            {user.name?.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-foreground">
                            {user.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {user.email}
                      </td>
                      <td className="px-6 py-4">
                        {editingRoleId === user.id ? (
                          <div className="relative">
                            <select
                              defaultValue={user.role}
                              onChange={(e) =>
                                handleRoleChange(user.id, e.target.value)
                              }
                              onBlur={() => setEditingRoleId(null)}
                              autoFocus
                              className="appearance-none bg-card border border-luxury-gold rounded-lg px-3 py-1.5 pr-7 text-sm focus:outline-none"
                            >
                              {ROLES.map((r) => (
                                <option key={r} value={r}>
                                  {r}
                                </option>
                              ))}
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 pointer-events-none text-muted-foreground" />
                          </div>
                        ) : (
                          <button
                            onClick={() => setEditingRoleId(user.id)}
                            className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                          >
                            <ShieldCheck className="h-3 w-3" />
                            {user.role}
                          </button>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            user.status === "ACTIVE" || !user.status
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {user.status ?? "ACTIVE"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground text-xs">
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString()
                          : "—"}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleToggle(user.id)}
                            className="p-2 rounded-xl hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
                            title="Toggle Status"
                          >
                            {user.status === "INACTIVE" ? (
                              <ToggleLeft className="h-5 w-5 text-red-500" />
                            ) : (
                              <ToggleRight className="h-5 w-5 text-green-500" />
                            )}
                          </button>
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="p-2 rounded-xl hover:bg-red-50 text-muted-foreground hover:text-red-600 transition-colors"
                            title="Delete User"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Pagination */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-6"
      >
        {pagination && <Pagination currentPage={pagination.page} totalPages={pagination.totalPages} onPageChange={setPage} />}
      </motion.div>
    </div>
  );
}
