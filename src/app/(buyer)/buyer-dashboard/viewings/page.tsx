"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Calendar,
  Clock,
  Search,
  Filter,
  CheckCircle,
  AlertCircle,
  MapPin,
  Home,
  Plus,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import PaymentButton from "@/components/payment/PaymentButton";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Pagination } from "@/components/ui/Pagination";
import {
  useGetMyViewingsQuery,
  useCreateViewingMutation,
  useUpdateViewingStatusMutation,
} from "@/redux/api/viewing";
import { useGetPropertiesQuery } from "@/redux/api/propertyApi";
import { IProperty, IViewing } from "@/types";
import Link from "next/link";

interface ViewingData {
  date: string;
  duration?: number;
  notes?: string;
}

export default function BuyerViewingsPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [selectedProperty, setSelectedProperty] = useState<IProperty | null>(
    null,
  );
  const [viewingForm, setViewingForm] = useState<ViewingData>({
    date: "",
    notes: "",
  });

  const { data: viewingsData, isLoading: viewingsLoading } =
    useGetMyViewingsQuery({
      searchTerm,
      status: statusFilter !== "all" ? statusFilter : undefined,
      page,
      limit,
    });

  const { data: propertiesData } = useGetPropertiesQuery({ limit: 20 });
  const [createViewing] = useCreateViewingMutation();
  const [updateViewingStatus] = useUpdateViewingStatusMutation();

  const viewings: IViewing[] = viewingsData?.data || [];
  const properties: IProperty[] = propertiesData?.data || [];
  const pagination = viewingsData?.meta ?? {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleCreateViewing = async (propertyId: string, data: ViewingData) => {
    console.log("handleCreateViewing called with:", { propertyId, data });
    console.log("Auth state:", { isAuthenticated, user });

    if (!isAuthenticated) {
      toast.error("Please sign in to schedule a viewing");
      return;
    }

    if (!propertyId) {
      toast.error("Please select a property");
      return;
    }

    if (!data.date) {
      toast.error("Please select a date and time");
      return;
    }

    try {
      console.log("Calling createViewing mutation...");
      console.log("Original date from form:", data.date);

      // Try different date formats
      const dateObj = new Date(data.date);
      const formats = {
        iso: dateObj.toISOString(),
        local: dateObj.toLocaleString(),
        dateOnly: dateObj.toISOString().split("T")[0],
        datetimeLocal: data.date,
        custom: dateObj.toISOString().replace(".000Z", "Z"),
      };

      console.log("Trying date formats:", formats);

      const customFormat = dateObj.toISOString();
      console.log("Using ISO format:", customFormat);

      const result = await createViewing({
        propertyId,
        viewingDate: customFormat,
        notes: data.notes,
      }).unwrap();

      console.log("createViewing result:", result);
      toast.success("Viewing request scheduled successfully!");
      setIsBookingOpen(false);
      // Reset form
      setViewingForm({ date: "", notes: "" });
      setSelectedProperty(null);
    } catch (error) {
      console.error("Failed to create viewing:", error);
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || "Failed to send viewing request");
    }
  };

  const handleCancelViewing = async (viewingId: string) => {
    try {
      await updateViewingStatus({
        viewingId,
        data: { status: "cancelled" },
      }).unwrap();

      toast.success("Viewing cancelled successfully!");
    } catch (error) {
      console.error("Failed to cancel viewing:", error);
      toast.error("Failed to cancel viewing");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case "SCHEDULED":
        return "bg-blue-100/80 text-blue-700 border-blue-200 backdrop-blur-md";
      case "COMPLETED":
        return "bg-green-100/80 text-green-700 border-green-200 backdrop-blur-md";
      case "CANCELLED":
        return "bg-red-100/80 text-red-700 border-red-200 backdrop-blur-md";
      case "PENDING":
        return "bg-yellow-100/80 text-yellow-700 border-yellow-200 backdrop-blur-md";
      default:
        return "bg-gray-100/80 text-gray-700 border-gray-200 backdrop-blur-md";
    }
  };

  if (isLoading || viewingsLoading) {
    return (
      <div className="space-y-8 p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-muted rounded-2xl w-64"></div>
          <div className="h-4 bg-muted rounded-xl w-96"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-muted rounded-[2rem]"></div>
            ))}
          </div>
        </div>
        <div className="space-y-6 mt-12">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-48 bg-muted rounded-[2.5rem] animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="p-12 rounded-[2.5rem] bg-red-50/50 backdrop-blur-xl border border-red-100 text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
          <AlertCircle className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-heading font-bold text-red-900 mb-3">
          Login Required
        </h2>
        <p className="text-red-700 mb-8 max-w-sm mx-auto">
          Sign in to your LuxeLiving account to access and manage your property
          viewing appointments.
        </p>
        <Link href="/login">
          <Button className="bg-red-600 hover:bg-red-700 text-white rounded-2xl px-10 h-14 font-bold shadow-lg shadow-red-200 transition-all active:scale-95">
            Go to Login
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20 px-1">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl lg:text-6xl font-black text-foreground tracking-tight"
          >
            My Tours
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground mt-3 text-lg leading-relaxed max-w-2xl"
          >
            Manage and track all your property viewing appointments in one place
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Button
            onClick={() => setIsBookingOpen(true)}
            className="bg-luxury-gold hover:bg-luxury-gold/90 text-luxury-slate rounded-xl h-12 px-6 font-bold shadow-lg transition-all hover:shadow-xl hover:-translate-y-1 active:scale-95"
          >
            <Plus className="w-5 h-5 mr-2" />
            Schedule Appointment
          </Button>
        </motion.div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
        {[
          {
            label: "TOTAL REQUESTS",
            value: viewings.length,
            icon: Calendar,
            color: "bg-blue-500/10 text-blue-500 border-blue-500/20",
          },
          {
            label: "AWAITING APPROVAL",
            value: viewings.filter((v) => v.status?.toUpperCase() === "PENDING")
              .length,
            icon: AlertCircle,
            color: "bg-orange-500/10 text-orange-500 border-orange-500/20",
          },
          {
            label: "SCHEDULED",
            value: viewings.filter(
              (v) => v.status?.toUpperCase() === "SCHEDULED",
            ).length,
            icon: Clock,
            color: "bg-purple-500/10 text-purple-500 border-purple-500/20",
          },
          {
            label: "COMPLETED",
            value: viewings.filter(
              (v) => v.status?.toUpperCase() === "COMPLETED",
            ).length,
            icon: CheckCircle,
            color: "bg-green-500/10 text-green-500 border-green-500/20",
          },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-6 rounded-xl bg-card border ${stat.color} shadow-sm hover:shadow-md transition-all duration-300`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider opacity-70 mb-1">
                  {stat.label}
                </p>
                <p className="text-3xl font-black">
                  {stat.value.toString().padStart(2, "0")}
                </p>
              </div>
              <div className={`p-3 rounded-xl bg-current/10`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card border border-border rounded-xl p-4 shadow-sm"
      >
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/50" />
            <Input
              placeholder="Search by property or location..."
              className="pl-12 h-12 rounded-lg bg-muted/30 border-none focus:ring-2 focus:ring-luxury-gold/20 transition-all text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value || "all")}
            >
              <SelectTrigger className="h-12 rounded-lg bg-muted/30 border-none px-4 font-semibold min-w-37">
                <SelectValue placeholder="FILTER STATUS" />
              </SelectTrigger>
              <SelectContent className="rounded-lg border-none shadow-lg">
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              className="h-12 rounded-lg border-border bg-muted/30 hover:bg-muted/40 px-4 font-semibold"
            >
              <Filter className="w-4 h-4 mr-2" />
              SORT BY DATE
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Viewings List - Data Table */}
      {viewings.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-24 bg-muted/10 rounded-[3rem] border border-dashed border-border"
        >
          <div className="w-28 h-28 bg-muted rounded-full flex items-center justify-center mx-auto mb-6 text-muted-foreground/20">
            <Calendar className="w-12 h-12" />
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-3">
            No active inquiries
          </h3>
          <p className="text-muted-foreground mb-10 max-w-sm mx-auto leading-relaxed">
            Your viewing calendar is empty. Ready to discover your future home
            among our elite properties?
          </p>
          <Button
            onClick={() => setIsBookingOpen(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white rounded-2xl h-14 px-10 font-black shadow-xl shadow-purple-200"
          >
            Start Exploring
          </Button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-xl overflow-hidden shadow-lg"
        >
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              {/* Table Header */}
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    PROPERTY INFORMATION
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    DATE & TIME
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    LOCATION
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    VALUE
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    STATUS
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    PAYMENT
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    ACTION
                  </th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-border/30">
                {viewings.map((viewing: IViewing, index: number) => (
                  <motion.tr
                    key={viewing.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-muted/20 transition-colors duration-200"
                  >
                    {/* Property Information Column */}
                    <td className="px-4 py-4">
                      <div className="flex items-start gap-3">
                        <div className="h-12 w-12 rounded-lg bg-linear-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white shadow-md shrink-0">
                          <Home className="w-6 h-6" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-foreground text-sm">
                            {viewing.property?.title || "Spacious & Elegant Family Apartment"}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {viewing.property?.bedrooms?.toLocaleString() || 3} Beds •{" "}
                            {viewing.property?.bathrooms?.toLocaleString() || 2} Baths •{" "}
                            {viewing.property?.area?.toLocaleString() || 2500} sqft
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Date & Time Column */}
                    <td className="px-4 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm font-medium text-foreground">
                          <Calendar className="w-4 h-4 mr-2 text-purple-400" />
                          {viewing.viewingDate
                            ? new Date(viewing.viewingDate).toLocaleDateString(
                                undefined,
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                },
                              )
                            : "Apr 17, 2026"}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="w-4 h-4 mr-2 text-purple-400" />
                          {viewing.viewingDate
                            ? new Date(viewing.viewingDate).toLocaleTimeString(
                                [],
                                { hour: "2-digit", minute: "2-digit" },
                              )
                            : "03:27 AM"}
                        </div>
                      </div>
                    </td>

                    {/* Location Column */}
                    <td className="px-4 py-4">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4 mr-2 text-purple-400" />
                        {viewing.property?.location || "New York"}
                      </div>
                    </td>

                    {/* Value Column */}
                    <td className="px-4 py-4">
                      <p className="font-bold text-foreground text-sm">
                        ${viewing.property?.price?.toLocaleString() || '999'}
                      </p>
                    </td>

                    {/* Status Column */}
                    <td className="px-4 py-4">
                      <Badge
                        className={`${getStatusColor(viewing.status)} px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border shadow-sm`}
                      >
                        {viewing.status?.toUpperCase() || "SCHEDULED"}
                      </Badge>
                    </td>

                    {/* Payment Column */}
                    <td className="px-4 py-4">
                      <Badge
                        className={`${
                          viewing.paymentStatus === "PAID"
                            ? "bg-green-500/20 text-green-600 border-green-300"
                            : "bg-orange-500/20 text-orange-600 border-orange-300"
                        } px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border shadow-sm`}
                      >
                        {viewing.paymentStatus === "PAID" ? "PAID" : "UNPAID"}
                      </Badge>
                    </td>

                    {/* Action Column */}
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-2">
                        {/* Payment Button */}
                        {viewing.paymentStatus !== "PAID" &&
                          (viewing.status?.toUpperCase() === "PENDING" ||
                            viewing.status === "pending" ||
                            viewing.status?.toUpperCase() === "SCHEDULED") && (
                            <PaymentButton
                              bookingId={viewing.id || ""}
                              viewingTitle={`${viewing.property?.title} Viewing`}
                              className="h-8 px-3 bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg text-xs font-bold shadow-md transition-all duration-300"
                            >
                              <CreditCard className="w-3 h-3 mr-1" />
                              Pay
                            </PaymentButton>
                          )}

                        {/* View Details Button */}
                        <Link
                          href={`/properties/${viewing.property?.id || ""}`}
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 px-3 rounded-lg border-purple-300/30 text-purple-600 hover:bg-purple-600 hover:text-white text-xs font-semibold transition-all duration-300"
                          >
                            View
                          </Button>
                        </Link>

                        {/* Cancel Button */}
                        {viewing.status?.toUpperCase() === "PENDING" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleCancelViewing(viewing.id || "")
                            }
                            className="h-8 px-3 rounded-lg text-red-500 hover:bg-red-50 text-xs font-semibold transition-all duration-300"
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Responsive Cards */}
          <div className="lg:hidden divide-y divide-border/30">
            {viewings.map((viewing: IViewing, index: number) => (
              <motion.div
                key={viewing.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 space-y-3"
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-linear-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white">
                      <Home className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-foreground text-sm">
                        {viewing.property?.title || "Exclusive Estate"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {viewing.property?.location || "Prime Location"}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Badge
                      className={`${getStatusColor(viewing.status)} px-2 py-1 rounded-full text-[10px] font-bold uppercase`}
                    >
                      {viewing.status || "PENDING"}
                    </Badge>
                    <Badge
                      className={`${
                        viewing.paymentStatus === "PAID"
                          ? "bg-green-500/20 text-green-600 border-green-300"
                          : "bg-orange-500/20 text-orange-600 border-orange-300"
                      } px-2 py-1 rounded-full text-[10px] font-bold uppercase`}
                    >
                      {viewing.paymentStatus === "PAID" ? "PAID" : "UNPAID"}
                    </Badge>
                  </div>
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-purple-400 font-semibold mb-1">Agent</p>
                    <p className="text-foreground font-medium">
                      {viewing.agent?.name || 'Naimur'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-purple-400 font-semibold mb-1">Date</p>
                    <p className="text-foreground font-medium">
                      {viewing.viewingDate ? new Date(viewing.viewingDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Apr 17, 2026'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-purple-400 font-semibold mb-1">Time</p>
                    <p className="text-foreground font-medium">
                      {viewing.viewingDate ? new Date(viewing.viewingDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '03:27 AM'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-purple-400 font-semibold mb-1">Value</p>
                    <p className="text-foreground font-bold">
                      ${viewing.property?.price?.toLocaleString() || '999'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-purple-400 font-semibold mb-1">Notes</p>
                    <p className="text-muted-foreground text-xs truncate">
                      {viewing.notes || 'None'}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  {(viewing.paymentStatus !== "PAID" &&
                    (viewing.status?.toUpperCase() === "PENDING" ||
                      viewing.status === "pending" ||
                      viewing.status?.toUpperCase() === "SCHEDULED")) && (
                    <PaymentButton
                      bookingId={viewing.id || ""}
                      viewingTitle={`${viewing.property?.title} Viewing`}
                      className="flex-1 h-8 bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg text-xs font-bold"
                    >
                      <CreditCard className="w-3 h-3 mr-1" />
                      Pay
                    </PaymentButton>
                  )}
                  <Link
                    href={`/properties/${viewing.property?.id || ""}`}
                    className="flex-1"
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 px-3 rounded-lg border-purple-300/30 text-purple-600 hover:bg-purple-600 hover:text-white text-xs font-semibold"
                    >
                      View
                    </Button>
                  </Link>
                  {viewing.status?.toUpperCase() === "PENDING" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCancelViewing(viewing.id || "")}
                      className="h-8 px-3 rounded-lg text-red-500 hover:bg-red-50 text-xs font-semibold"
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Booking Dialog */}
      <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Schedule Property Viewing</DialogTitle>
            <DialogDescription>
              Select a property and schedule your viewing appointment.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div>
              <Label htmlFor="property">Select Property</Label>
              <Select
                onValueChange={(value) => {
                  const property = properties.find((p) => p.id === value);
                  setSelectedProperty(property || null);
                }}
              >
                <SelectTrigger className="mt-2 rounded-xl">
                  <SelectValue placeholder="Choose a property to view" />
                </SelectTrigger>
                <SelectContent>
                  {properties.map((property) => (
                    <SelectItem key={property.id} value={property.id}>
                      {property.title} - ${property.price?.toLocaleString()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedProperty && (
              <div className="bg-muted/50 rounded-xl p-4">
                <h4 className="font-semibold mb-2">{selectedProperty.title}</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedProperty.location}
                </p>
                <p className="text-luxury-emerald font-semibold mt-1">
                  ${selectedProperty.price?.toLocaleString()}
                </p>
              </div>
            )}

            <div className="space-y-3">
              <Label className="uppercase tracking-widest text-[10px] font-black opacity-50">
                Select Date & Time
              </Label>
              <Input
                id="date"
                type="datetime-local"
                className="h-14 rounded-2xl bg-luxury-slate/5 border-none text-lg font-bold"
                min={new Date().toISOString().slice(0, 16)}
                value={viewingForm.date}
                onChange={(e) =>
                  setViewingForm((prev) => ({ ...prev, date: e.target.value }))
                }
              />
            </div>

            <div className="space-y-3">
              <Label className="uppercase tracking-widest text-[10px] font-black opacity-50">
                Special Requirements
              </Label>
              <Textarea
                id="notes"
                placeholder="Any specific focus for your tour?"
                className="rounded-2xl bg-luxury-slate/5 border-none p-6 text-lg min-h-30 resize-none"
                value={viewingForm.notes}
                onChange={(e) =>
                  setViewingForm((prev) => ({ ...prev, notes: e.target.value }))
                }
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                onClick={() => setIsBookingOpen(false)}
                variant="outline"
                className="flex-1 h-16 rounded-2xl border-luxury-slate/10 font-bold"
              >
                Cancel
              </Button>
              <Button
                onClick={() =>
                  handleCreateViewing(selectedProperty?.id || "", viewingForm)
                }
                className="flex-1 h-16 rounded-2xl bg-luxury-slate text-white font-black text-lg shadow-xl hover:bg-black transition-all"
                disabled={!selectedProperty || !viewingForm.date}
              >
                Confirm Request
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}
