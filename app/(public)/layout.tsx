import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import NavigationLoadingOverlay from "@/components/layout/NavigationLoadingOverlay";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavigationLoadingOverlay />
      <Navbar />
      <main>{children}</main>
      <div className="relative z-[2]"><Footer /></div>
    </>
  );
}
