import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getAllCategories } from "@/lib/firebase/categories";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = await getAllCategories();

  return (
    <>
      <Navbar categories={categories} />
      <main>{children}</main>
      <Footer />
    </>
  );
}
