"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { apiUpdateHomeSection } from "@/lib/admin-api";
import type { HomeContent } from "@/types/home-content";

// ── Generic section card ──────────────────────────────────────────────────────

interface Field {
  name: string;
  label: string;
  type: "input" | "textarea";
  rows?: number;
}

interface SectionCardProps<K extends keyof HomeContent> {
  title: string;
  description: string;
  section: K;
  fields: Field[];
  defaultValues: HomeContent[K];
}

function SectionCard<K extends keyof HomeContent>({
  title,
  description,
  section,
  fields,
  defaultValues,
}: SectionCardProps<K>) {
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm({ defaultValues: defaultValues as Record<string, string> });

  async function onSubmit(values: Record<string, string>) {
    setError(null);
    setSaved(false);
    try {
      await apiUpdateHomeSection(section, values);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError("Failed to save. Please try again.");
    }
  }

  return (
    <div className="bg-white border border-cream-dark rounded-sm p-6">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-walnut">{title}</h2>
        <p className="text-sm text-stone mt-0.5">{description}</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {fields.map((f) => (
            <FormField
              key={f.name}
              control={form.control}
              name={f.name}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-walnut">{f.label}</FormLabel>
                  <FormControl>
                    {f.type === "textarea" ? (
                      <Textarea
                        rows={f.rows ?? 3}
                        className="border-stone/30 focus:border-terracotta resize-none"
                        {...field}
                      />
                    ) : (
                      <Input
                        className="border-stone/30 focus:border-terracotta"
                        {...field}
                      />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex items-center gap-3 pt-1">
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="bg-terracotta hover:bg-terracotta-dark text-cream"
            >
              {form.formState.isSubmitting ? "Saving…" : "Save Section"}
            </Button>
            {saved && (
              <span className="text-sm text-green-700 font-medium">Saved!</span>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}

// ── Main page component ───────────────────────────────────────────────────────

export default function HomeContentClient({ content }: { content: HomeContent }) {
  return (
    <div className="space-y-6">
      <SectionCard
        title="Hero Banner"
        description="The full-screen opening section at the top of the home page."
        section="hero"
        defaultValues={content.hero}
        fields={[
          { name: "tagline", label: "Tagline (small text above headline)", type: "input" },
          { name: "headline", label: "Headline", type: "input" },
          { name: "subtext", label: "Subtext (paragraph below headline)", type: "textarea", rows: 3 },
          { name: "ctaLabel", label: "Button Label", type: "input" },
        ]}
      />

      <SectionCard
        title="Intro Section"
        description="The centred text block below the hero banner."
        section="intro"
        defaultValues={content.intro}
        fields={[
          { name: "title", label: "Title", type: "input" },
          { name: "body", label: "Body Text", type: "textarea", rows: 4 },
        ]}
      />

      <SectionCard
        title="Collections Section"
        description="The heading above the list of categories."
        section="collections"
        defaultValues={content.collections}
        fields={[
          { name: "title", label: "Title", type: "input" },
          { name: "subtitle", label: "Subtitle", type: "input" },
        ]}
      />

      <SectionCard
        title="Enquiry Section"
        description="The contact form section at the bottom of the home page."
        section="enquiry"
        defaultValues={content.enquiry}
        fields={[
          { name: "title", label: "Title", type: "input" },
          { name: "subtitle", label: "Subtitle", type: "input" },
        ]}
      />
    </div>
  );
}
