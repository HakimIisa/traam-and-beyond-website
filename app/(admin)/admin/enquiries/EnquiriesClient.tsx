"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { apiMarkEnquiryRead } from "@/lib/admin-api";
import type { Enquiry } from "@/types";
import { cn } from "@/lib/utils";

interface Props {
  enquiries: Enquiry[];
}

export default function EnquiriesClient({ enquiries: initial }: Props) {
  const [enquiries, setEnquiries] = useState(initial);

  const general = enquiries.filter((e) => e.type === "general");
  const itemSpecific = enquiries.filter((e) => e.type === "item-specific");
  const unreadGeneral = general.filter((e) => !e.read).length;
  const unreadItem = itemSpecific.filter((e) => !e.read).length;

  async function toggleRead(id: string, current: boolean) {
    const newRead = !current;
    // Optimistic update
    setEnquiries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, read: newRead } : e))
    );
    try {
      await apiMarkEnquiryRead(id, newRead);
    } catch {
      // Revert on failure
      setEnquiries((prev) =>
        prev.map((e) => (e.id === id ? { ...e, read: current } : e))
      );
    }
  }

  return (
    <Tabs defaultValue="general">
      <TabsList className="bg-cream-dark mb-6">
        <TabsTrigger value="general" className="data-[state=active]:bg-white data-[state=active]:text-walnut">
          General
          {unreadGeneral > 0 && (
            <span className="ml-2 bg-terracotta text-cream text-xs rounded-full px-1.5 py-0.5">
              {unreadGeneral}
            </span>
          )}
        </TabsTrigger>
        <TabsTrigger value="item-specific" className="data-[state=active]:bg-white data-[state=active]:text-walnut">
          Item Enquiries
          {unreadItem > 0 && (
            <span className="ml-2 bg-terracotta text-cream text-xs rounded-full px-1.5 py-0.5">
              {unreadItem}
            </span>
          )}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="general">
        <EnquiryList enquiries={general} onToggleRead={toggleRead} />
      </TabsContent>
      <TabsContent value="item-specific">
        <EnquiryList enquiries={itemSpecific} onToggleRead={toggleRead} showItem />
      </TabsContent>
    </Tabs>
  );
}

function EnquiryList({
  enquiries,
  onToggleRead,
  showItem = false,
}: {
  enquiries: Enquiry[];
  onToggleRead: (id: string, current: boolean) => void;
  showItem?: boolean;
}) {
  if (enquiries.length === 0) {
    return (
      <div className="bg-white border border-cream-dark rounded-sm p-8 text-center text-stone text-sm">
        No enquiries yet.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {enquiries.map((e) => (
        <div
          key={e.id}
          className={cn(
            "bg-white border rounded-sm p-5 transition-colors",
            e.read ? "border-cream-dark" : "border-terracotta/40 bg-terracotta/5"
          )}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="font-medium text-walnut text-sm">{e.name}</span>
                <a
                  href={`mailto:${e.email}`}
                  className="text-xs text-terracotta hover:underline"
                >
                  {e.email}
                </a>
                {!e.read && (
                  <Badge className="bg-terracotta text-cream text-xs px-2 py-0 h-5">
                    New
                  </Badge>
                )}
              </div>

              {showItem && e.itemTitle && (
                <p className="text-xs text-stone mb-2">
                  Item: <span className="font-medium text-walnut">{e.itemTitle}</span>
                </p>
              )}

              <p className="text-sm text-stone leading-relaxed whitespace-pre-wrap">{e.message}</p>

              <p className="text-xs text-stone/60 mt-2">
                {new Date(e.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>

            <button
              onClick={() => onToggleRead(e.id, e.read)}
              className={cn(
                "flex-shrink-0 text-xs px-3 py-1.5 rounded-sm border transition-colors",
                e.read
                  ? "border-stone/30 text-stone hover:border-walnut hover:text-walnut"
                  : "border-terracotta text-terracotta hover:bg-terracotta hover:text-cream"
              )}
            >
              {e.read ? "Mark Unread" : "Mark Read"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
