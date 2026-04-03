"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import ImageUploadField from "./ImageUploadField";
import { slugify } from "@/lib/utils";
import { apiCreateCategory, apiUpdateCategory } from "@/lib/admin-api";
import type { Category } from "@/types";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  order: z.string().min(1, "Order is required"),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface CategoryFormProps {
  existing?: Category;
}

export default function CategoryForm({ existing }: CategoryFormProps) {
  const router = useRouter();
  const [coverImage, setCoverImage] = useState<string[]>(
    existing?.coverImage ? [existing.coverImage] : []
  );
  const [error, setError] = useState<string | null>(null);

  const storagePath = existing
    ? `categories/${existing.id}`
    : `categories/temp-${Date.now()}`;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: existing?.name ?? "",
      order: String(existing?.order ?? 0),
      description: existing?.description ?? "",
    },
  });

  async function onSubmit(values: FormValues) {
    setError(null);
    const orderNum = parseInt(values.order, 10);
    if (isNaN(orderNum) || orderNum < 0) {
      setError("Order must be a number 0 or greater.");
      return;
    }
    try {
      const data = {
        name: values.name,
        slug: slugify(values.name),
        order: orderNum,
        coverImage: coverImage[0] ?? "",
        description: values.description ?? "",
      };
      if (existing) {
        await apiUpdateCategory(existing.id, data);
      } else {
        await apiCreateCategory(data);
      }
      router.push("/admin/categories");
      router.refresh();
    } catch {
      setError("Failed to save category. Please try again.");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-lg">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-walnut">Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Copper" className="border-stone/30 focus:border-terracotta" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-walnut">
                Description{" "}
                <span className="text-stone font-normal">(shown on home page)</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  rows={4}
                  placeholder="Describe this category — its history, craft tradition, and what makes it special..."
                  className="border-stone/30 focus:border-terracotta resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="order"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-walnut">Display Order</FormLabel>
              <FormControl>
                <Input type="number" min={0} className="border-stone/30 focus:border-terracotta" {...field} />
              </FormControl>
              <p className="text-xs text-stone">Lower numbers appear first in the navbar.</p>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <p className="text-sm font-medium text-walnut">Cover Image</p>
          <ImageUploadField
            images={coverImage}
            onChange={setCoverImage}
            storagePath={storagePath}
            single
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex gap-3">
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="bg-terracotta hover:bg-terracotta-dark text-cream"
          >
            {form.formState.isSubmitting ? "Saving..." : existing ? "Save Changes" : "Create Category"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/categories")}
            className="border-stone/30 text-walnut"
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
