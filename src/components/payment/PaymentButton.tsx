"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { CreditCard, Shield, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCreateCheckoutSessionMutation } from "@/redux/api/paymentApi";
import { useAuth } from "@/hooks/useAuth";

interface PaymentButtonProps {
  bookingId?: string;
  viewingTitle?: string;
  amount?: number;
  className?: string;
  children?: React.ReactNode;
}

export default function PaymentButton({
  bookingId,
  amount,
  className,
  children,
}: PaymentButtonProps) {
  const { user, isAuthenticated } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [createCheckoutSession] = useCreateCheckoutSessionMutation();

  const handlePayment = async () => {
    if (!isAuthenticated || !user) {
      toast.error("Please sign in to proceed with payment");
      return;
    }

    if (!bookingId) {
      toast.error("Missing booking information");
      return;
    }

    setIsProcessing(true);

    try {
      const result = await createCheckoutSession(bookingId!).unwrap();

      if (result.data?.paymentSessionUrl) {
        // Redirect to Stripe Checkout
        window.location.href = result.data.paymentSessionUrl;
      } else {
        toast.error("Failed to initialize payment. Please try again.");
      }
    } catch (error: unknown) {
      console.error("Payment initialization error:", error);
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message ||
        "Payment initialization failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="inline-block"
    >
      <Button
        onClick={handlePayment}
        disabled={isProcessing || !isAuthenticated}
        className={`relative overflow-hidden ${className || ""}`}
      >
        {isProcessing ? (
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Processing...
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            {children || "Pay Now"}
            {amount && (
              <span className="font-bold ml-1">${amount.toLocaleString()}</span>
            )}
          </div>
        )}

        {/* Security Badge */}
        <div className="absolute -top-1 -right-1 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
          <Shield className="w-3 h-3" />
          <span>Secure</span>
        </div>
      </Button>
    </motion.div>
  );
}
