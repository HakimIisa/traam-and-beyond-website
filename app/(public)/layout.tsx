import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <div className="relative z-[2]"><Footer /></div>
    </>
  );
}
