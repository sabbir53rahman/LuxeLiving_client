"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Star, Send, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCreateAgentReviewMutation } from "@/redux/api/agentApi";
import { AgentReviewData } from "@/types/agent";

interface AgentReviewFormProps {
  agentId: string;
  agentName: string;
  propertyId?: string;
  propertyTitle?: string;
  onSuccess?: () => void;
}

export function AgentReviewForm({
  agentId,
  agentName,
  propertyId,
  propertyTitle,
  onSuccess,
}: AgentReviewFormProps) {
  const [createReview, { isLoading }] = useCreateAgentReviewMutation();
  const [formData, setFormData] = useState<AgentReviewData>({
    agentId,
    rating: 0,
    comment: "",
    professionalism: 5,
    communication: 5,
    marketKnowledge: 5,
    helpfulness: 5,
    propertyId,
  });

  const handleRatingChange = (field: keyof AgentReviewData, value: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (!formData.comment.trim()) {
      toast.error("Please provide a comment");
      return;
    }

    try {
      await createReview(formData).unwrap();
      toast.success("Review submitted successfully!");

      // Reset form
      setFormData({
        agentId,
        rating: 0,
        comment: "",
        professionalism: 5,
        communication: 5,
        marketKnowledge: 5,
        helpfulness: 5,
        propertyId,
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: unknown) {
      console.error("Failed to submit review:", error);
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message ||
        "Failed to submit review. Please try again.";
      toast.error(errorMessage);
    }
  };

  const renderStars = (rating: number, onChange: (value: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="p-1 hover:scale-110 transition-transform"
          >
            <Star
              className={`w-6 h-6 ${
                star <= rating
                  ? "text-yellow-400 fill-current"
                  : "text-gray-300"
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="rounded-3xl border-border shadow-sm max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Review Agent</CardTitle>
          <CardDescription>
            Share your experience with {agentName}
            {propertyTitle && (
              <>
                {" "}
                for property:{" "}
                <span className="font-semibold">{propertyTitle}</span>
              </>
            )}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Overall Rating */}
            <div>
              <Label className="text-base font-semibold mb-3 block">
                Overall Rating <span className="text-red-500">*</span>
              </Label>
              {renderStars(formData.rating, (value) =>
                handleRatingChange("rating", value),
              )}
              <p className="text-sm text-muted-foreground mt-1">
                Click on stars to rate your experience
              </p>
            </div>

            {/* Detailed Ratings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium block mb-2">
                  Professionalism
                </Label>
                {renderStars(formData.professionalism, (value) =>
                  handleRatingChange("professionalism", value),
                )}
              </div>

              <div>
                <Label className="text-sm font-medium block mb-2">
                  Communication
                </Label>
                {renderStars(formData.communication, (value) =>
                  handleRatingChange("communication", value),
                )}
              </div>

              <div>
                <Label className="text-sm font-medium block mb-2">
                  Market Knowledge
                </Label>
                {renderStars(formData.marketKnowledge, (value) =>
                  handleRatingChange("marketKnowledge", value),
                )}
              </div>

              <div>
                <Label className="text-sm font-medium block mb-2">
                  Helpfulness
                </Label>
                {renderStars(formData.helpfulness, (value) =>
                  handleRatingChange("helpfulness", value),
                )}
              </div>
            </div>

            {/* Comment */}
            <div>
              <Label
                htmlFor="comment"
                className="text-sm font-medium block mb-2"
              >
                Your Review <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="comment"
                value={formData.comment}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, comment: e.target.value }))
                }
                className="rounded-xl min-h-24"
                placeholder="Share your experience working with this agent..."
                rows={4}
                required
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-luxury-emerald hover:bg-luxury-emerald-light text-white rounded-xl px-8"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit Review
                  </>
                )}
              </Button>
            </div>
          </form>

          {/* Help Text */}
          <div className="mt-6 p-4 bg-muted/30 rounded-lg border border-border/50">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-muted-foreground mt-0.5" />
              <div className="text-sm text-muted-foreground">
                <p className="font-medium mb-1">Review Guidelines:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Be honest and specific about your experience</li>
                  <li>Rate the agent&apos;s professionalism and communication</li>
                  <li>Mention specific details about the property viewing</li>
                  <li>
                    Your review helps other buyers make informed decisions
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
