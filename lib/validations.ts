import { z } from "zod";

export const enquirySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  itemId: z.string().optional(),
  itemTitle: z.string().optional(),
  type: z.enum(["general", "item-specific"]),
});

export type EnquirySchema = z.infer<typeof enquirySchema>;

export const itemSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().nullable(),
  notForSale: z.boolean(),
  dimensions: z.string().nullable(),
  categoryId: z.string().min(1, "Category is required"),
  categorySlug: z.string().min(1),
  categoryName: z.string().min(1),
  images: z.array(z.string()).min(1, "At least one image is required"),
});

export const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1),
  order: z.number().int().min(0),
  coverImage: z.string().optional(),
});
