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
import { apiCreateStory, apiUpdateStory } from "@/lib/admin-api";
import type { StoryItem } from "@/types";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().min(1, "Subtitle is required"),
  body: z.string().min(1, "Story body is required"),
  order: z.coerce.number().int().min(0, "Order must be 0 or greater"),
});

type FormValues = z.infer<typeof schema>;

interface StoryFormProps {
  existing?: StoryItem;
}

export default function StoryForm({ existing }: StoryFormProps) {
  const router = useRouter();
  const [images, setImages] = useState<string[]>(existing?.image ? [existing.image] : []);
  const [error, setError] = useState<string | null>(null);

  const storagePath = existing
    ? `stories/${existing.id}`
    : `stories/temp-${Date.now()}`;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      title: existing?.title ?? "",
      subtitle: existing?.subtitle ?? "",
      body: existing?.body ?? "",
      order: existing?.order ?? 0,
    },
  });

  async function onSubmit(values: FormValues) {
    setError(null);
    try {
      const data = {
        title: values.title,
        subtitle: values.subtitle,
        body: values.body,
        order: values.order,
        image: images[0] ?? "",
      };
      if (existing) {
        await apiUpdateStory(existing.id, data);
      } else {
        await apiCreateStory(data);
      }
      router.push("/admin/stories");
      router.refresh();
    } catch {
      setError("Failed to save story. Please try again.");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-lg">
        <FormField
          control={form.control as any}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-walnut">Heading</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. The First Masterpiece"
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
          name="subtitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-walnut">Sub-heading</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. Jawaharnagar, Srinagar — February 2004"
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
          name="body"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-walnut">Story Body</FormLabel>
              <FormControl>
                <Textarea
                  rows={16}
                  placeholder="Write the story here..."
                  className="border-stone/30 focus:border-terracotta resize-y"
                  {...field}
                />
              </FormControl>
              <p className="text-xs text-stone">Separate paragraphs with a blank line.</p>
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
              <p className="text-xs text-stone">Lower numbers appear first.</p>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <p className="text-sm font-medium text-walnut">Image</p>
          <ImageUploadField
            images={images}
            onChange={setImages}
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
            {form.formState.isSubmitting ? "Saving..." : existing ? "Save Changes" : "Create Story"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/stories")}
            className="border-stone/30 text-walnut"
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
