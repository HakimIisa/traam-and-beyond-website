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
import { apiCreateResearchItem, apiUpdateResearchItem } from "@/lib/admin-api";
import type { ResearchItem } from "@/types";

const SECTIONS = [
  { slug: "adaptive-reuse", label: "Adaptive Reuse" },
  { slug: "reinterpretation", label: "Reinterpretation" },
  { slug: "graphic-design", label: "Graphic Design" },
];

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  sectionSlug: z.string().min(1, "Section is required"),
  order: z.coerce.number().int().min(0, "Order must be 0 or greater"),
});

type FormValues = z.infer<typeof schema>;

interface ResearchItemFormProps {
  existing?: ResearchItem;
}

export default function ResearchItemForm({ existing }: ResearchItemFormProps) {
  const router = useRouter();
  const [images, setImages] = useState<string[]>(existing?.images ?? []);
  const [error, setError] = useState<string | null>(null);

  const storagePath = existing
    ? `research/${existing.id}`
    : `research/temp-${Date.now()}`;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      title: existing?.title ?? "",
      description: existing?.description ?? "",
      sectionSlug: existing?.sectionSlug ?? "",
      order: existing?.order ?? 0,
    },
  });

  async function onSubmit(values: FormValues) {
    setError(null);
    try {
      const data = {
        slug: existing?.slug ?? slugify(values.title),
        title: values.title,
        description: values.description ?? "",
        sectionSlug: values.sectionSlug,
        order: values.order,
        images,
      };
      if (existing) {
        await apiUpdateResearchItem(existing.id, data);
      } else {
        await apiCreateResearchItem(data);
      }
      router.push("/admin/research");
      router.refresh();
    } catch {
      setError("Failed to save research item. Please try again.");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-lg">
        <FormField
          control={form.control as any}
          name="sectionSlug"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-walnut">Section</FormLabel>
              <FormControl>
                <select
                  {...field}
                  className="w-full border border-stone/30 rounded-sm px-3 py-2 text-sm text-walnut bg-white focus:outline-none focus:border-terracotta"
                >
                  <option value="">Choose a research section...</option>
                  {SECTIONS.map((sec) => (
                    <option key={sec.slug} value={sec.slug}>{sec.label}</option>
                  ))}
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control as any}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-walnut">Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. Coffee Table"
                  className="border-stone/30 focus:border-terracotta"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control as any}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-walnut">
                Description{" "}
                <span className="text-stone font-normal">(optional)</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  rows={5}
                  placeholder="Describe this research item..."
                  className="border-stone/30 focus:border-terracotta resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control as any}
          name="order"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-walnut">Display Order</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={0}
                  className="border-stone/30 focus:border-terracotta"
                  {...field}
                />
              </FormControl>
              <p className="text-xs text-stone">Lower numbers appear first within the section.</p>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <p className="text-sm font-medium text-walnut">
            Images{" "}
            <span className="text-stone font-normal">(multiple allowed)</span>
          </p>
          <ImageUploadField
            images={images}
            onChange={setImages}
            storagePath={storagePath}
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex gap-3">
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="bg-terracotta hover:bg-terracotta-dark text-cream"
          >
            {form.formState.isSubmitting ? "Saving..." : existing ? "Save Changes" : "Create Item"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/research")}
            className="border-stone/30 text-walnut"
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
