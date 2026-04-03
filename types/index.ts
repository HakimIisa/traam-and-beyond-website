export interface Category {
  id: string;
  name: string;
  slug: string;
  order: number;
  coverImage?: string;
  description?: string;
  createdAt: string;
}

export interface Item {
  id: string;
  title: string;
  description: string;
  price: number | null;
  notForSale: boolean;
  dimensions: string | null;
  categoryId: string;
  categorySlug: string;
  categoryName: string;
  images: string[];
  searchTokens: string[];
  createdAt: string;
}

export interface Enquiry {
  id: string;
  name: string;
  email: string;
  message: string;
  itemId: string | null;
  itemTitle: string | null;
  type: "general" | "item-specific";
  read: boolean;
  createdAt: string;
}

export interface EnquiryFormData {
  name: string;
  email: string;
  message: string;
  itemId?: string;
  itemTitle?: string;
  type: "general" | "item-specific";
}
