"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { apiUpdateAboutSection } from "@/lib/admin-api";
import type { AboutContent } from "@/types/about-content";

// ── Generic section card ──────────────────────────────────────────────────────

interface Field {
  name: string;
  label: string;
  type: "input" | "textarea";
  rows?: number;
}

interface SectionCardProps<K extends keyof AboutContent> {
  title: string;
  description: string;
  section: K;
  fields: Field[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  defaultValues: Record<string, any>;
}

function SectionCard<K extends keyof AboutContent>({
  title,
  description,
  section,
  fields,
  defaultValues,
}: SectionCardProps<K>) {
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const form = useForm<Record<string, any>>({ defaultValues });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function onSubmit(values: Record<string, any>) {
    setError(null);
    setSaved(false);
    try {
      await apiUpdateAboutSection(section, values);
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

export default function AboutContentClient({ content }: { content: AboutContent }) {
  return (
    <div className="space-y-6">
      <SectionCard
        title="Intro Section"
        description="The opening section with the page heading and brand story paragraphs."
        section="intro"
        defaultValues={{
          heading: content.intro.heading,
          paragraph1: content.intro.paragraph1,
          paragraph2: content.intro.paragraph2,
          paragraph3: content.intro.paragraph3,
        }}
        fields={[
          { name: "heading", label: "Page Heading", type: "input" },
          { name: "paragraph1", label: "Paragraph 1", type: "textarea", rows: 3 },
          { name: "paragraph2", label: "Paragraph 2", type: "textarea", rows: 4 },
          { name: "paragraph3", label: "Paragraph 3", type: "textarea", rows: 3 },
        ]}
      />

      <SectionCard
        title="The Crafts Section"
        description='The heading and four craft description cards ("Copper", "Silver", etc.).'
        section="crafts"
        defaultValues={{
          heading: content.crafts.heading,
          copper: { name: content.crafts.copper.name, desc: content.crafts.copper.desc },
          silver: { name: content.crafts.silver.name, desc: content.crafts.silver.desc },
          jade: { name: content.crafts.jade.name, desc: content.crafts.jade.desc },
          papierMache: { name: content.crafts.papierMache.name, desc: content.crafts.papierMache.desc },
        }}
        fields={[
          { name: "heading", label: "Section Heading", type: "input" },
          { name: "copper.name", label: "Copper — Name", type: "input" },
          { name: "copper.desc", label: "Copper — Description", type: "textarea", rows: 2 },
          { name: "silver.name", label: "Silver — Name", type: "input" },
          { name: "silver.desc", label: "Silver — Description", type: "textarea", rows: 2 },
          { name: "jade.name", label: "Jade — Name", type: "input" },
          { name: "jade.desc", label: "Jade — Description", type: "textarea", rows: 2 },
          { name: "papierMache.name", label: "Papier-mâché — Name", type: "input" },
          { name: "papierMache.desc", label: "Papier-mâché — Description", type: "textarea", rows: 2 },
        ]}
      />

      <SectionCard
        title="Enquiry Section"
        description="The contact form heading and subtitle at the bottom of the about page."
        section="enquiry"
        defaultValues={{
          title: content.enquiry.title,
          subtitle: content.enquiry.subtitle,
        }}
        fields={[
          { name: "title", label: "Title", type: "input" },
          { name: "subtitle", label: "Subtitle", type: "input" },
        ]}
      />
    </div>
  );
}
