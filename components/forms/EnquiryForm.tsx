"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { enquirySchema, type EnquirySchema } from "@/lib/validations";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EnquiryFormProps {
  type: "general" | "item-specific";
  itemId?: string;
  itemTitle?: string;
  onSuccess?: () => void;
  className?: string;
}

export default function EnquiryForm({
  type,
  itemId,
  itemTitle,
  onSuccess,
  className,
}: EnquiryFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<EnquirySchema>({
    resolver: zodResolver(enquirySchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
      type,
      itemId: itemId ?? "",
      itemTitle: itemTitle ?? "",
    },
  });

  async function onSubmit(values: EnquirySchema) {
    setError(null);
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("Failed to submit");
      setSubmitted(true);
      onSuccess?.();
    } catch {
      setError("Something went wrong. Please try again.");
    }
  }

  if (submitted) {
    return (
      <div className={cn("py-8 text-center", className)}>
        <p className="text-walnut font-medium text-lg">Thank you!</p>
        <p className="text-stone text-sm mt-1">
          Your enquiry has been submitted. We&apos;ll be in touch shortly.
        </p>
      </div>
    );
  }

  return (
    <div className={className}>
      {type === "item-specific" && itemTitle && (
        <p className="text-sm text-stone mb-4">
          Enquiring about: <span className="font-medium text-walnut">{itemTitle}</span>
        </p>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-walnut text-sm">Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Your name"
                    className="bg-white border-stone/30 focus:border-terracotta text-walnut"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-walnut text-sm">Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    className="bg-white border-stone/30 focus:border-terracotta text-walnut"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-walnut text-sm">Message</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Your message..."
                    rows={4}
                    className="bg-white border-stone/30 focus:border-terracotta text-walnut resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="w-full bg-terracotta hover:bg-terracotta-dark text-cream"
          >
            {form.formState.isSubmitting ? "Sending..." : "Send Enquiry"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
