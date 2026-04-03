import { Resend } from "resend";
import type { EnquiryFormData } from "@/types";

export async function sendEnquiryNotification(data: EnquiryFormData): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    console.log("[DEV] Email skipped (RESEND_API_KEY not set). Enquiry data:", {
      name: data.name,
      email: data.email,
      type: data.type,
    });
    return;
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  const subject =
    data.type === "item-specific"
      ? `New Enquiry: ${data.itemTitle}`
      : "New General Enquiry";

  const itemLine =
    data.type === "item-specific"
      ? `<p><strong>Item:</strong> ${data.itemTitle}</p>`
      : "";

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: process.env.OWNER_EMAIL!,
    subject,
    html: `
      <h2>${subject}</h2>
      ${itemLine}
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Message:</strong></p>
      <p>${data.message.replace(/\n/g, "<br>")}</p>
    `,
  });

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: data.email,
    subject: "We received your enquiry — Traam and Beyond",
    html: `
      <p>Hello ${data.name},</p>
      <p>Thank you for reaching out. We have received your enquiry and will get back to you shortly.</p>
      ${data.itemTitle ? `<p>You enquired about: <strong>${data.itemTitle}</strong></p>` : ""}
      <br/>
      <p>Warm regards,<br/>Traam and Beyond</p>
    `,
  });
}
