import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";
import { adminGetAllCategories } from "@/lib/firebase/admin-categories";
import DeleteCategoryButton from "./DeleteCategoryButton";
import SeedCategoriesButton from "./SeedCategoriesButton";

export default async function CategoriesPage() {
  const categories = await adminGetAllCategories();

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-semibold text-walnut">Categories</h1>
          <p className="text-stone text-sm mt-1">{categories.length} categories</p>
        </div>
        <div className="flex items-center gap-2">
          <SeedCategoriesButton />
          <Link
            href="/admin/categories/new"
            className="flex items-center gap-2 px-4 py-2.5 bg-terracotta text-cream text-sm rounded-sm hover:bg-terracotta-dark transition-colors"
          >
            <Plus size={16} /> Add Category
          </Link>
        </div>
      </div>

      <div className="bg-white border border-cream-dark rounded-sm overflow-hidden">
        {categories.length === 0 ? (
          <p className="text-stone text-sm p-8 text-center">No categories yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-cream-dark bg-cream">
              <tr>
                <th className="text-left px-4 py-3 text-stone font-medium">Cover</th>
                <th className="text-left px-4 py-3 text-stone font-medium">Name</th>
                <th className="text-left px-4 py-3 text-stone font-medium">Slug</th>
                <th className="text-left px-4 py-3 text-stone font-medium">Order</th>
                <th className="text-right px-4 py-3 text-stone font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-dark">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-cream/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="w-10 h-10 rounded-sm overflow-hidden bg-cream-dark">
                      {cat.coverImage && (
                        <Image
                          src={cat.coverImage}
                          alt={cat.name}
                          width={40}
                          height={40}
                          className="object-cover w-full h-full"
                        />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium text-walnut">{cat.name}</td>
                  <td className="px-4 py-3 text-stone font-mono text-xs">{cat.slug}</td>
                  <td className="px-4 py-3 text-stone">{cat.order}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/categories/${cat.id}`}
                        className="text-xs px-3 py-1.5 border border-walnut text-walnut rounded-sm hover:bg-walnut/5 transition-colors"
                      >
                        Edit
                      </Link>
                      <DeleteCategoryButton id={cat.id} name={cat.name} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
