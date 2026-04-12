"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { CheckCircle, Home, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useVerifyPaymentQuery } from "@/redux/api/paymentApi";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");

  const { data, isLoading, error } = useVerifyPaymentQuery(sessionId || "", {
    skip: !sessionId,
  });

  useEffect(() => {
    if (data?.success) {
      toast.success("Payment verified! Your viewing is confirmed.");
      
      // Redirect to dashboard after 3 seconds
      const timer = setTimeout(() => {
        router.push("/buyer-dashboard/viewings");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [data, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-luxury-slate via-luxury-emerald/5 to-luxury-gold/5 flex items-center justify-center p-4">
        <Card className="rounded-3xl border-border shadow-sm">
          <CardHeader className="text-center">
            <div className="w-12 h-12 border-4 border-luxury-emerald border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <CardTitle>Verifying Payment...</CardTitle>
            <CardDescription>
              Please wait while we confirm your payment.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (error || !data?.success) {
    return (
      <div className="min-h-screen bg-linear-to-br from-luxury-slate via-luxury-emerald/5 to-luxury-gold/5 flex items-center justify-center p-4">
        <Card className="rounded-3xl border-border shadow-sm">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-600 text-xl">!</span>
            </div>
            <CardTitle className="text-red-600">Payment Verification Failed</CardTitle>
            <CardDescription>
              We couldn&apos;t verify your payment. Please contact support.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/")} className="w-full">
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const payment = data?.data?.payment;

  return (
    <div className="min-h-screen bg-linear-to-br from-luxury-slate via-luxury-emerald/5 to-luxury-gold/5 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <Card className="rounded-3xl border-border shadow-sm">
          <CardHeader className="text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <CardTitle className="text-green-600">Payment Successful!</CardTitle>
            <CardDescription>
              Your viewing appointment has been confirmed and paid for.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Payment Details */}
            {payment && (
              <div className="bg-muted/50 rounded-xl p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Transaction ID</span>
                  <span className="text-sm font-mono">{payment.id || sessionId}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Amount</span>
                  <span className="text-sm font-semibold">
                    ${payment.amount ? (payment.amount / 100).toFixed(2) : '50.00'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <span className="text-sm font-semibold text-green-600">Paid</span>
                </div>
                {payment.created && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Date</span>
                    <span className="text-sm">
                      {new Date(payment.created * 1000).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Success Message */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <p className="text-sm text-green-700">
                <strong>Confirmation:</strong> You will receive an email with your viewing details and agent contact information shortly.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={() => router.push("/buyer-dashboard/viewings")}
                className="w-full bg-luxury-emerald hover:bg-luxury-emerald-light text-white rounded-xl"
              >
                <Calendar className="w-4 h-4 mr-2" />
                View My Appointments
              </Button>
              
              <Button
                variant="outline"
                onClick={() => router.push("/")}
                className="w-full rounded-xl"
              >
                <Home className="w-4 h-4 mr-2" />
                Go to Dashboard
              </Button>
            </div>

            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                Redirecting to your appointments in 3 seconds...
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-linear-to-br from-luxury-slate via-luxury-emerald/5 to-luxury-gold/5 flex items-center justify-center p-4">
        <Card className="rounded-3xl border-border shadow-sm">
          <CardHeader className="text-center">
            <div className="w-12 h-12 border-4 border-luxury-emerald border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <CardTitle>Loading...</CardTitle>
            <CardDescription>
              Please wait...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}
