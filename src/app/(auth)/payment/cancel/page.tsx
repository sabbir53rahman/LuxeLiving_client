"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { XCircle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function PaymentCancelPage() {
  const router = useRouter();

  useEffect(() => {
    // Log payment cancellation for analytics
    console.log("Payment cancelled by user");
  }, []);

  const handleRetry = () => {
    // Go back to previous page or dashboard
    router.back();
  };

  const handleGoHome = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-luxury-slate via-luxury-emerald/5 to-luxury-gold/5 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <Card className="rounded-3xl border-border shadow-sm">
          <CardHeader className="text-center">
            <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <CardTitle className="text-red-600">Payment Cancelled</CardTitle>
            <CardDescription>
              Your payment has been cancelled. Your viewing request is not confirmed.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="text-sm text-amber-700">
                <strong>Note:</strong> You can reschedule your viewing at any time from your dashboard.
              </p>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleRetry}
                variant="outline"
                className="w-full rounded-xl"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              
              <Button
                onClick={handleGoHome}
                className="w-full bg-luxury-emerald hover:bg-luxury-emerald-light text-white rounded-xl"
              >
                <Home className="w-4 h-4 mr-2" />
                Go to Dashboard
              </Button>
            </div>

            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                Need help? Contact our support team for assistance.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
