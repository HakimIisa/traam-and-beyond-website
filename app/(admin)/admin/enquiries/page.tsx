import { getAllEnquiries } from "@/lib/firebase/enquiries";
import EnquiriesClient from "./EnquiriesClient";

export default async function EnquiriesPage() {
  const enquiries = await getAllEnquiries();
  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-walnut">Enquiries</h1>
        <p className="text-stone text-sm mt-1">
          {enquiries.filter((e) => !e.read).length} unread ·{" "}
          {enquiries.length} total
        </p>
      </div>
      <EnquiriesClient enquiries={enquiries} />
    </div>
  );
}
