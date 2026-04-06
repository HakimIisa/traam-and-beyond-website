import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BottomTabBar from "@/components/layout/BottomTabBar";
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
      <main className="pb-20 lg:pb-0">{children}</main>
      <Footer />
      <BottomTabBar categories={categories} />
    </>
  );
}
