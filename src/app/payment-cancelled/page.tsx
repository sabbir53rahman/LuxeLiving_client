"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { XCircle, Home, RefreshCw, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

function PaymentCancelledContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  return (
    <div className="min-h-screen bg-linear-to-br from-red-50 to-orange-50">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center px-4 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl w-full"
        >
          <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
            {/* Cancelled Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <XCircle className="w-10 h-10 text-red-600" />
            </motion.div>

            {/* Error Message */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold text-red-600 mb-4"
            >
              Payment Cancelled
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-gray-600 mb-8"
            >
              Your payment was cancelled or could not be completed. No charges were made to your account.
            </motion.p>

            {/* Session Info */}
            {sessionId && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-gray-50 rounded-2xl p-4 mb-8 text-left"
              >
                <p className="text-sm text-gray-600 mb-2">Session ID:</p>
                <p className="font-mono text-xs bg-gray-200 p-2 rounded">{sessionId}</p>
              </motion.div>
            )}

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-4"
            >
              <Link href="/buyer-dashboard/viewings">
                <Button className="w-full bg-red-600 hover:bg-red-700 text-white rounded-xl h-12 font-semibold">
                  <Home className="w-5 h-5 mr-2" />
                  Back to My Bookings
                </Button>
              </Link>

              <Link href="/properties">
                <Button variant="outline" className="w-full border-red-200 text-red-600 hover:bg-red-50 rounded-xl h-12 font-semibold">
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Browse Properties
                </Button>
              </Link>
            </motion.div>

            {/* Contact Support */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="pt-6 border-t border-gray-200"
            >
              <p className="text-sm text-gray-600 mb-4">
                Need help with your payment? Our support team is here to assist you.
              </p>
              <div className="flex justify-center gap-4">
                <Button variant="outline" size="sm" className="rounded-lg">
                  <Mail className="w-4 h-4 mr-2" />
                  Email Support
                </Button>
                <Button variant="outline" size="sm" className="rounded-lg">
                  <Phone className="w-4 h-4 mr-2" />
                  Call Support
                </Button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}

export default function PaymentCancelledPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-linear-to-br from-red-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p>Loading...</p>
        </div>
      </div>
    }>
      <PaymentCancelledContent />
    </Suspense>
  );
}
