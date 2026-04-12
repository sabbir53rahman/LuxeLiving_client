"use client";

import { motion } from "framer-motion";
import {
  CalendarCheck,
  Trash2,
  Clock,
  ChevronDown,
  Home,
  MapPin,
} from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { Pagination } from "@/components/ui/Pagination";
import { IViewing } from "@/types";
import {
  useGetAllViewingsQuery,
  useUpdateViewingStatusMutation,
  useDeleteViewingMutation,
} from "@/redux/api/viewing";
import Image from "next/image";

const STATUSES = ["SCHEDULED", "CONFIRMED", "CANCELLED", "COMPLETED"];

const statusColors: Record<string, string> = {
  SCHEDULED: "bg-blue-100 text-blue-700",
  CONFIRMED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
  COMPLETED: "bg-purple-100 text-purple-700",
};

export default function AdminViewingsPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const { data, isLoading, isError } = useGetAllViewingsQuery({ page, limit });
  const [updateStatus] = useUpdateViewingStatusMutation();
  const [deleteViewing] = useDeleteViewingMutation();

  const viewings: IViewing[] = data?.data ?? [];

  const total = data?.meta?.total ?? viewings.length;
  const metaLimit = data?.meta?.limit ?? limit;
  const totalPages =
    data?.meta?.totalPages ?? (total > 0 ? Math.ceil(total / metaLimit) : 0);
  const currentPage = data?.meta?.page ?? 1;
  const pagination = { total, limit: metaLimit, page: currentPage, totalPages };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await updateStatus({ id, data: { status } }).unwrap();
      toast.success("Status updated successfully");
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this viewing appointment?"))
      return;
    try {
      await deleteViewing(id).unwrap();
      toast.success("Viewing deleted successfully");
    } catch {
      toast.error("Failed to delete viewing");
    }
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-1">
          <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20">
            <CalendarCheck className="h-7 w-7 text-purple-600" />
          </div>
          <div>
            <h1 className="text-3xl font-heading font-bold text-foreground tracking-tight">
              Viewing Appointments
            </h1>
            <p className="text-muted-foreground mt-1">
              Monitor and manage property tours and potential buyer schedules.
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="rounded-[2.5rem] bg-card/50 backdrop-blur-xl border border-border/50 shadow-2xl overflow-hidden"
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center h-64 text-muted-foreground gap-4">
            <div className="p-4 rounded-full bg-red-50 text-red-500">
              <Clock className="h-8 w-8" />
            </div>
            <p>Failed to synchronize viewing data.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-border/50 bg-muted/20">
                  <th className="text-left px-8 py-5 font-bold text-muted-foreground uppercase tracking-wider text-xs">
                    Property
                  </th>
                  <th className="text-left px-8 py-5 font-bold text-muted-foreground uppercase tracking-wider text-xs">
                    Buyer Details
                  </th>
                  <th className="text-left px-8 py-5 font-bold text-muted-foreground uppercase tracking-wider text-xs">
                    Assigned Agent
                  </th>
                  <th className="text-left px-8 py-5 font-bold text-muted-foreground uppercase tracking-wider text-xs">
                    Schedule
                  </th>
                  <th className="text-left px-8 py-5 font-bold text-muted-foreground uppercase tracking-wider text-xs">
                    Payments
                  </th>
                  <th className="text-left px-8 py-5 font-bold text-muted-foreground uppercase tracking-wider text-xs">
                    Status
                  </th>
                  <th className="text-right px-8 py-5 font-bold text-muted-foreground uppercase tracking-wider text-xs">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {viewings.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-20">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <CalendarCheck className="h-10 w-10 opacity-20" />
                        <p className="font-medium">
                          No viewing appointments scheduled yet.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  viewings.map((viewing) => (
                    <tr
                      key={viewing.id}
                      className="group hover:bg-muted/5 transition-all duration-300"
                    >
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="h-14 w-14 rounded-2xl overflow-hidden border border-border shadow-sm shrink-0">
                            {viewing.property?.images &&
                            viewing.property.images.length > 0 ? (
                              <Image
                                width={50}
                                height={50}
                                src={viewing.property.images[0]}
                                alt={viewing.property.title}
                                className="h-full w-full object-cover transition-transform group-hover:scale-110"
                              />
                            ) : (
                              <div className="h-full w-full bg-muted flex items-center justify-center">
                                <Home className="h-6 w-6 text-muted-foreground/30" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-foreground text-base line-clamp-1">
                              {viewing.property?.title ?? "Untitled Estate"}
                            </p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                              <MapPin className="h-3 w-3" />
                              {viewing.property?.location ?? "N/A"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-linear-to-br from-purple-50 to-purple-100 flex items-center justify-center text-purple-600 font-bold border border-purple-200 uppercase">
                            {viewing.buyer?.name.charAt(0) ?? "U"}
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">
                              {viewing.buyer?.name ?? "Unknown Buyer"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {viewing.buyer?.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5 font-medium text-muted-foreground">
                        {viewing.agent?.name ?? (
                          <span className="text-xs italic opacity-50">
                            Not Assigned
                          </span>
                        )}
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2 text-foreground font-semibold">
                            <Clock className="h-4 w-4 text-purple-500" />
                            {viewing.viewingDate
                              ? new Date(
                                  viewing.viewingDate,
                                ).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "—"}
                          </div>
                          <p className="text-xs text-muted-foreground pl-6">
                            {viewing.viewingDate
                              ? new Date(
                                  viewing.viewingDate,
                                ).toLocaleDateString(undefined, {
                                  dateStyle: "medium",
                                })
                              : "—"}
                          </p>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                            viewing.paymentStatus === "PAID"
                              ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                              : "bg-orange-50 text-orange-600 border-orange-100"
                          }`}
                        >
                          {viewing.paymentStatus}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="relative group/select">
                          <select
                            value={viewing.status}
                            onChange={(e) =>
                              handleStatusChange(viewing.id, e.target.value)
                            }
                            className={`appearance-none pl-4 pr-10 py-2 rounded-2xl text-xs font-bold border focus:ring-4 focus:ring-purple-500/10 transition-all cursor-pointer ${
                              statusColors[viewing.status] ??
                              "bg-gray-100 text-gray-700 border-gray-200"
                            }`}
                          >
                            {STATUSES.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none text-current" />
                        </div>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <button
                          onClick={() => handleDelete(viewing.id)}
                          className="h-10 w-10 flex items-center justify-center rounded-2xl hover:bg-red-50 text-muted-foreground hover:text-red-600 transition-all active:scale-90"
                          title="Delete Appointment"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Pagination component with luxury styling */}
      <div className="mt-8 flex justify-center">
        <div className="bg-card p-2 rounded-3xl border border-border shadow-soft">
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
}
