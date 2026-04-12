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
    notes: ""
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
  const pagination = viewingsData?.meta ?? { total: 0, page: 1, limit: 10, totalPages: 0 };

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
        dateOnly: dateObj.toISOString().split('T')[0],
        datetimeLocal: data.date,
        custom: dateObj.toISOString().replace('.000Z', 'Z')
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
            <div key={i} className="h-48 bg-muted rounded-[2.5rem] animate-pulse"></div>
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
          Sign in to your LuxeLiving account to access and manage your property viewing appointments.
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
            className="text-4xl lg:text-5xl font-heading font-bold text-foreground tracking-tight"
          >
            My Tours
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground mt-3 text-lg leading-relaxed max-w-xl"
          >
            Orchestrate your property discovery journey with ease and elegance.
          </motion.p>
        </div>
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
        >
            <Button
            onClick={() => setIsBookingOpen(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white rounded-2xl h-14 px-8 font-black shadow-xl shadow-purple-200 transition-all hover:-translate-y-1 active:scale-95"
            >
            <Plus className="w-6 h-6 mr-2" />
            Schedule Appointment
            </Button>
        </motion.div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
        {[
          {
            label: "Total Requests",
            value: viewings.length,
            icon: Calendar,
            color: "bg-blue-50 text-blue-500",
          },
          {
            label: "Awaiting Approval",
            value: viewings.filter((v) => v.status?.toUpperCase() === "PENDING").length,
            icon: AlertCircle,
            color: "bg-yellow-50 text-yellow-600",
          },
          {
            label: "Scheduled",
            value: viewings.filter((v) => v.status?.toUpperCase() === "SCHEDULED").length,
            icon: Clock,
            color: "bg-purple-50 text-purple-600",
          },
          {
            label: "Completed",
            value: viewings.filter((v) => v.status?.toUpperCase() === "COMPLETED").length,
            icon: CheckCircle,
            color: "bg-emerald-50 text-emerald-600",
          },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-6 lg:p-8 rounded-[2rem] bg-card border border-border shadow-soft flex items-center justify-between group hover:border-foreground/10 transition-colors"
          >
            <div>
              <p className="text-xs uppercase tracking-widest font-black text-muted-foreground/60 mb-1">{stat.label}</p>
              <p className="text-3xl font-heading font-black">{stat.value}</p>
            </div>
            <div className={`p-3 rounded-2xl ${stat.color} transition-transform group-hover:scale-110`}>
                <stat.icon className="w-6 h-6" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card/40 backdrop-blur-md p-5 rounded-3xl border border-border/50 shadow-sm"
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="relative md:col-span-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/50" />
            <Input
              placeholder="Filter by estate name or location..."
              className="pl-12 h-14 rounded-2xl bg-muted/30 border-none focus:ring-2 focus:ring-purple-500/20 transition-all text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="md:col-span-3">
              <Select
                value={statusFilter}
                onValueChange={(value) => setStatusFilter(value || "all")}
              >
                <SelectTrigger className="h-14 rounded-2xl bg-muted/30 border-none px-6 font-semibold">
                  <SelectValue placeholder="Status Filter" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-none shadow-2xl">
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">PendingApproval</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="completed">Completed Tours</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
          </div>
          <Button variant="ghost" className="md:col-span-3 h-14 rounded-2xl font-bold bg-muted/20 hover:bg-muted/40 px-6">
            <Filter className="w-5 h-5 mr-2 opacity-50" />
            Advanced
          </Button>
        </div>
      </motion.div>

      {/* Viewings List */}
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
            Your viewing calendar is empty. Ready to discover your future home among our elite properties?
          </p>
          <Button
            onClick={() => setIsBookingOpen(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white rounded-2xl h-14 px-10 font-black shadow-xl shadow-purple-200"
          >
            Start Exploring
          </Button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {viewings.map((viewing: IViewing, index: number) => (
            <motion.div
              key={viewing.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group bg-card hover:bg-muted/5 rounded-[2.5rem] border border-border shadow-soft p-1 transition-all duration-500"
            >
              <div className="flex flex-col h-full p-6 lg:p-8">
                <div className="flex justify-between items-start mb-8">
                  <div className="flex gap-2">
                    <Badge variant="outline" className={`${getStatusColor(viewing.status)} px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border shadow-sm ring-4 ring-background`}>
                      {viewing.status || 'PENDING'}
                    </Badge>
                    
                    {/* Payment Status Badge */}
                    <Badge 
                      variant="outline" 
                      className={`${
                        viewing.paymentStatus === "PAID" 
                          ? "bg-green-100/80 text-green-700 border-green-200" 
                          : "bg-orange-100/80 text-orange-700 border-orange-200"
                      } px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border shadow-sm ring-4 ring-background`}
                    >
                      {viewing.paymentStatus === "PAID" ? "PAID" : "PAYMENT DUE"}
                    </Badge>
                  </div>
                  
                  <div className="h-14 w-14 rounded-2xl bg-luxury-emerald/5 border border-luxury-emerald/10 flex items-center justify-center text-luxury-emerald group-hover:bg-luxury-emerald group-hover:text-white transition-all duration-500 shadow-sm">
                    <Home className="w-7 h-7" />
                  </div>
                </div>

                <div className="flex-1 space-y-6">
                  <div>
                    <h3 className="text-2xl font-heading font-black text-foreground group-hover:text-purple-600 transition-colors duration-300">
                      {viewing.property?.title || "Exclusive Estate"}
                    </h3>
                    <div className="flex items-center text-muted-foreground mt-2 font-medium">
                      <MapPin className="w-4 h-4 mr-2 text-purple-500" />
                      <span className="text-sm">
                        {viewing.property?.location || "Prime Location"}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 py-6 border-y border-border/50">
                    <div className="space-y-1">
                        <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/50">Appointment Date</p>
                        <div className="flex items-center text-foreground font-bold text-lg">
                           <Calendar className="w-4 h-4 mr-2 text-purple-400" />
                           {viewing.viewingDate ? new Date(viewing.viewingDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Pending'}
                        </div>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/50">Arrival Time</p>
                        <div className="flex items-center text-foreground font-bold text-lg">
                           <Clock className="w-4 h-4 mr-2 text-purple-400" />
                           {viewing.viewingDate ? new Date(viewing.viewingDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'TBD'}
                        </div>
                    </div>
                  </div>

                  {viewing.notes && (
                    <div className="bg-muted/30 rounded-2xl p-4 border border-border/20 italic text-sm text-muted-foreground leading-relaxed">
                      &ldquo;{viewing.notes}&rdquo;
                    </div>
                  )}
                </div>

                <div className="mt-10 flex items-center justify-between">
                   <div className="space-y-1">
                      <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/50">Estate Value</p>
                      <p className="text-2xl font-black text-foreground">${viewing.property?.price?.toLocaleString()}</p>
                   </div>
                   
                   <div className="flex gap-3">
                         {/* Show payment button for viewings that haven't been paid for */}
                         {(viewing.paymentStatus !== "PAID" && (viewing.status?.toUpperCase() === "PENDING" || viewing.status === "pending" || viewing.status?.toUpperCase() === "SCHEDULED")) && (
                            <PaymentButton
                                bookingId={viewing.id || ""}
                                viewingTitle={`${viewing.property?.title} Viewing`}
                                className="rounded-2xl h-14 px-8 font-black text-sm bg-foreground text-background shadow-xl hover:bg-purple-600 hover:text-white transition-all active:scale-95"
                            />
                        )}
                         
                         {/* Show paid status for completed payments */}
                         {viewing.paymentStatus === "PAID" && (
                            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-green-100 text-green-700 border border-green-200">
                                <CheckCircle className="w-4 h-4" />
                                <span className="font-semibold text-sm">Paid</span>
                            </div>
                         )}
                        
                        <div className="flex flex-col gap-2">
                            <Link href={`/properties/${viewing.property?.id || ''}`}>
                                <Button
                                    variant="outline"
                                    className="rounded-2xl h-12 px-6 font-black text-xs border-foreground/10 hover:bg-foreground hover:text-background transition-colors"
                                >
                                    Details
                                </Button>
                            </Link>
                            
                            {viewing.status?.toUpperCase() === "PENDING" && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleCancelViewing(viewing.id || "")}
                                className="text-red-500 hover:bg-red-50 rounded-xl font-bold text-xs"
                            >
                                Withdraw
                            </Button>
                            )}
                        </div>
                   </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
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
              <Label className="uppercase tracking-widest text-[10px] font-black opacity-50">Select Date & Time</Label>
              <Input
                id="date"
                type="datetime-local"
                className="h-14 rounded-2xl bg-luxury-slate/5 border-none text-lg font-bold"
                min={new Date().toISOString().slice(0, 16)}
                value={viewingForm.date}
                onChange={e => setViewingForm(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>

            <div className="space-y-3">
              <Label className="uppercase tracking-widest text-[10px] font-black opacity-50">Special Requirements</Label>
              <Textarea
                id="notes"
                placeholder="Any specific focus for your tour?"
                className="rounded-2xl bg-luxury-slate/5 border-none p-6 text-lg min-h-30 resize-none"
                value={viewingForm.notes}
                onChange={e => setViewingForm(prev => ({ ...prev, notes: e.target.value }))}
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
                onClick={() => handleCreateViewing(selectedProperty?.id || "", viewingForm)}
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
