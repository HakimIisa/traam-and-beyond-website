"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import EnquiryForm from "./EnquiryForm";

interface EnquiryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item?: { id: string; title: string };
}

export default function EnquiryDialog({
  open,
  onOpenChange,
  item,
}: EnquiryDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-cream max-w-md">
        <DialogHeader>
          <DialogTitle className="text-walnut">
            {item ? "Enquire About Item" : "Get in Touch"}
          </DialogTitle>
        </DialogHeader>
        <EnquiryForm
          type={item ? "item-specific" : "general"}
          itemId={item?.id}
          itemTitle={item?.title}
          onSuccess={() => setTimeout(() => onOpenChange(false), 2000)}
        />
      </DialogContent>
    </Dialog>
  );
}
