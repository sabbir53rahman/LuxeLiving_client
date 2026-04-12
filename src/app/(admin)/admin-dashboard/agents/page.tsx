"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { UserCheck, Search, Trash2, Star, Phone, MapPin } from "lucide-react";
import { toast } from "sonner";
import {
  useGetAgentsQuery,
  useDeleteAgentMutation,
} from "@/redux/api/agentApi";
import { Pagination } from "@/components/ui/Pagination";

export default function AdminAgentsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(9);
  
  const { data, isLoading, isError } = useGetAgentsQuery({
    search: search || undefined,
    page,
    limit,
  });
  const [deleteAgent] = useDeleteAgentMutation();

  const agents: {
    id: string;
    name?: string;
    email?: string;
    contactNumber?: string;
    address?: string;
    experience?: number;
    hourlyRate?: number;
    averageRating?: number;
    isAvailable?: boolean;
    expertise?: string | null;
    user?: { name: string; email: string };
  }[] = data?.data ?? [];

  const pagination = data?.meta ?? { total: 0, page: 1, limit: 9, totalPages: 0 };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this agent from the platform?")) return;
    try {
      await deleteAgent(id).unwrap();
      toast.success("Agent removed.");
    } catch {
      toast.error("Failed to remove agent.");
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2 rounded-xl bg-emerald-100">
            <UserCheck className="h-6 w-6 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-heading font-bold text-foreground">
            Agents
          </h1>
        </div>
        <p className="text-muted-foreground mt-1 ml-1">
          Manage all registered agents on the platform.
        </p>
      </motion.div>

      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search by name or email…"
          className="w-full pl-11 pr-4 py-3 rounded-2xl bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-luxury-gold/50"
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-4 border-luxury-gold border-t-transparent rounded-full animate-spin" />
        </div>
      ) : isError ? (
        <div className="flex items-center justify-center h-48 text-muted-foreground">
          Failed to load agents.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {agents.length === 0 ? (
              <div className="col-span-3 text-center py-20 text-muted-foreground">
                No agents found.
              </div>
            ) : (
              agents.map((agent, i) => {
                const name = agent.name ?? agent.user?.name ?? "Unknown";
                const email = agent.email ?? agent.user?.email ?? "—";
                return (
                  <motion.div
                    key={agent.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="rounded-3xl bg-card border border-border shadow-sm hover:shadow-md transition-shadow p-6 space-y-4"
                  >
                    {/* Avatar + Name */}
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 rounded-2xl bg-emerald-50 flex items-center justify-center font-black text-emerald-600 text-xl shrink-0">
                        {name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-foreground font-heading truncate">{name}</h3>
                        <p className="text-xs text-muted-foreground truncate">{email}</p>
                      </div>
                      <span
                        className={`ml-auto shrink-0 px-2 py-1 rounded-full text-xs font-semibold ${
                          agent.isAvailable
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {agent.isAvailable ? "Available" : "Busy"}
                      </span>
                    </div>

                    {/* Details */}
                    <div className="space-y-2 text-sm">
                      {agent.expertise && (
                        <p className="text-muted-foreground">
                          <span className="font-medium text-foreground">Expertise:</span>{" "}
                          {agent.expertise}
                        </p>
                      )}
                      {agent.experience !== undefined && (
                        <p className="text-muted-foreground">
                          <span className="font-medium text-foreground">Experience:</span>{" "}
                          {agent.experience} yrs
                        </p>
                      )}
                      {agent.hourlyRate !== undefined && (
                        <p className="text-muted-foreground">
                          <span className="font-medium text-foreground">Rate:</span>{" "}
                          ${agent.hourlyRate}/hr
                        </p>
                      )}
                      {agent.contactNumber && (
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Phone className="h-3.5 w-3.5 shrink-0" />
                          {agent.contactNumber}
                        </div>
                      )}
                      {agent.address && (
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5 shrink-0" />
                          <span className="truncate">{agent.address}</span>
                        </div>
                      )}
                    </div>

                    {/* Rating + Actions */}
                    <div className="flex items-center justify-between pt-2 border-t border-border">
                      <div className="flex items-center gap-1.5">
                        < Star className="h-4 w-4 fill-luxury-gold text-luxury-gold" />
                        <span className="text-sm font-semibold">
                          {agent.averageRating?.toFixed(1) ?? "N/A"}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDelete(agent.id)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 border border-red-200 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Remove
                      </button>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>

          {/* Pagination */}
          <div className="mt-8">
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      )}
    </div>
  );
}
