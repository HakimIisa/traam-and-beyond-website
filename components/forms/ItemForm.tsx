"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import ImageUploadField from "./ImageUploadField";
import { apiCreateItem, apiUpdateItem } from "@/lib/admin-api";
import type { Item, Category } from "@/types";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  price: z.string().optional(),
  notForSale: z.boolean(),
  dimensions: z.string().optional(),
  categoryId: z.string().min(1, "Category is required"),
});

type FormValues = z.infer<typeof schema>;

interface ItemFormProps {
  existing?: Item;
  categories: Category[];
}

export default function ItemForm({ existing, categories }: ItemFormProps) {
  const router = useRouter();
  const [images, setImages] = useState<string[]>(existing?.images ?? []);
  const [error, setError] = useState<string | null>(null);

  const itemId = existing?.id ?? `item-${Date.now()}`;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: existing?.title ?? "",
      description: existing?.description ?? "",
      price: existing?.price != null ? String(existing.price) : "",
      notForSale: existing?.notForSale ?? false,
      dimensions: existing?.dimensions ?? "",
      categoryId: existing?.categoryId ?? "",
    },
  });

  const notForSale = form.watch("notForSale");

  async function onSubmit(values: FormValues) {
    setError(null);
    if (images.length === 0) {
      setError("Please upload at least one image.");
      return;
    }

    const selectedCategory = categories.find((c) => c.id === values.categoryId);
    if (!selectedCategory) {
      setError("Invalid category selected.");
      return;
    }

    try {
      const data = {
        title: values.title,
        description: values.description,
        price: values.notForSale ? null : values.price ? Number(values.price) : null,
        notForSale: values.notForSale,
        dimensions: values.dimensions || null,
        categoryId: selectedCategory.id,
        categorySlug: selectedCategory.slug,
        categoryName: selectedCategory.name,
        images,
      };

      if (existing) {
        await apiUpdateItem(existing.id, data);
      } else {
        await apiCreateItem(data);
      }

      router.push("/admin/items");
      router.refresh();
    } catch {
      setError("Failed to save item. Please try again.");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">

        {/* Images — shown first for visual-first workflow */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-walnut">Images <span className="text-red-500">*</span></p>
          <ImageUploadField
            images={images}
            onChange={setImages}
            storagePath={`items/${itemId}`}
          />
        </div>

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-walnut">Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Hand-Hammered Copper Tray" className="border-stone/30 focus:border-terracotta" {...field} />
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
              <FormLabel className="text-walnut">Description</FormLabel>
              <FormControl>
                <Textarea
                  rows={5}
                  placeholder="Describe the item, its origin, craftsmanship, and any notable features..."
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
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-walnut">Category</FormLabel>
              <FormControl>
                <select
                  {...field}
                  className="w-full border border-stone/30 rounded-sm px-3 py-2 text-sm text-walnut bg-white focus:outline-none focus:border-terracotta"
                >
                  <option value="">Select a category...</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Price / Not for Sale */}
        <div className="space-y-3">
          <FormField
            control={form.control}
            name="notForSale"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2">
                <FormControl>
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={field.onChange}
                    className="w-4 h-4 accent-terracotta"
                  />
                </FormControl>
                <FormLabel className="text-walnut !mt-0 cursor-pointer">Not for Sale</FormLabel>
              </FormItem>
            )}
          />

          {!notForSale && (
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-walnut">Price (₹)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      placeholder="e.g. 4500 (leave blank for Price on Request)"
                      className="border-stone/30 focus:border-terracotta"
                      {...field}
                    />
                  </FormControl>
                  <p className="text-xs text-stone">Leave blank to show &ldquo;Price on Request&rdquo;.</p>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        <FormField
          control={form.control}
          name="dimensions"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-walnut">Dimensions <span className="text-stone font-normal">(optional)</span></FormLabel>
              <FormControl>
                <Input placeholder="e.g. 45cm × 30cm × 3cm" className="border-stone/30 focus:border-terracotta" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
            onClick={() => router.push("/admin/items")}
            className="border-stone/30 text-walnut"
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
