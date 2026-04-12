"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  Loader2,
  ArrowRight,
  Home,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";
import { useVerifyPaymentQuery } from "@/redux/api/paymentApi";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  // Use the verifyPayment query
  const { data, isLoading, isError, error } = useVerifyPaymentQuery(
    sessionId as string,
    {
      skip: !sessionId,
    },
  );

  useEffect(() => {
    if (data?.success) {
      toast.success("Payment verified successfully!");
    }
    if (isError) {
      toast.error("Could not verify payment. Please contact support.");
      console.error("Verification error:", error);
    }
  }, [data, isError, error]);

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150 animate-pulse"></div>
          <Loader2 className="h-20 w-20 text-primary animate-spin relative z-10" />
        </div>
        <h1 className="mt-8 text-3xl font-black tracking-tight text-foreground">
          Verifying Payment...
        </h1>
        <p className="mt-4 text-muted-foreground font-medium text-center max-w-sm">
          Securing your transaction and confirming your mentorship slot.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-[90vh] flex items-center justify-center p-6 sm:p-12 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-125 h-125 bg-primary/5 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-100 h-100 bg-secondary/5 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3 pointer-events-none" />

      <div className="max-w-2xl w-full bg-card/40 backdrop-blur-xl border border-border/50 rounded-[3rem] p-10 sm:p-16 shadow-2xl relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-10">
            <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full scale-125 pulse"></div>
            <div className="h-24 w-24 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center relative z-10">
              <CheckCircle2 className="h-12 w-12 text-emerald-500" />
            </div>
          </div>

          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-black uppercase tracking-widest mb-6 border border-emerald-500/20 shadow-sm">
            Transaction Successful
          </span>

          <h1 className="text-4xl sm:text-5xl font-heading font-black tracking-tighter text-foreground mb-6">
            Session Confirmed!
          </h1>

          <p className="text-muted-foreground text-lg font-medium leading-relaxed max-w-md mb-12">
            Your payment was successfully processed. You&apos;ll receive an
            email shortly with the meeting details and calendar invite.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
            <Button className="h-14 rounded-2xl flex items-center justify-center bg-primary hover:bg-primary/90 text-white font-bold shadow-xl shadow-primary/25 gap-2 group">
              <Link href="/session-history">
                <Calendar className="h-5 w-5 group-hover:-rotate-12 transition-transform" />
                View Bookings
                <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button
              variant="outline"
              className="h-14 rounded-2xl font-bold border-border/60 hover:bg-muted flex items-center justify-center gap-2 transition-all"
            >
              <Link href="/student-dashboard">
                <Home className="h-5 w-5 mr-2 opacity-70" />
                Student Dashboard
              </Link>
            </Button>
          </div>

          <div className="mt-12 pt-10 border-t border-border/40 w-full flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-left">
              <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/60 mb-1">
                Session ID
              </p>
              <code className="text-[12px] font-mono font-bold bg-muted px-2 py-1 rounded-md text-foreground/80 truncate max-w-45 inline-block">
                {sessionId?.slice(0, 20)}...
              </code>
            </div>
            <p className="text-xs text-muted-foreground font-medium italic">
              Check your inbox for further instructions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
          <Loader2 className="h-20 w-20 text-primary animate-spin" />
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
