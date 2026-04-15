"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { apiUpdateAboutSection } from "@/lib/admin-api";
import type { AboutContent } from "@/types/about-content";

interface Field {
  name: string;
  label: string;
  rows?: number;
}

interface SectionCardProps<K extends keyof AboutContent> {
  title: string;
  description: string;
  section: K;
  fields: Field[];
  defaultValues: Record<string, string>;
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

  const form = useForm<Record<string, string>>({ defaultValues });

  async function onSubmit(values: Record<string, string>) {
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
                    <Textarea
                      rows={f.rows ?? 3}
                      className="border-stone/30 focus:border-terracotta resize-y"
                      {...field}
                    />
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

export default function AboutContentClient({ content }: { content: AboutContent }) {
  return (
    <div className="space-y-6">
      <SectionCard
        title="Introduction"
        description="The five paragraphs of the founder's story shown on the About page."
        section="introduction"
        defaultValues={{
          paragraph1: content.introduction.paragraph1,
          paragraph2: content.introduction.paragraph2,
          paragraph3: content.introduction.paragraph3,
          paragraph4: content.introduction.paragraph4,
          paragraph5: content.introduction.paragraph5,
        }}
        fields={[
          { name: "paragraph1", label: "Paragraph 1", rows: 5 },
          { name: "paragraph2", label: "Paragraph 2", rows: 3 },
          { name: "paragraph3", label: "Paragraph 3", rows: 3 },
          { name: "paragraph4", label: "Paragraph 4", rows: 4 },
          { name: "paragraph5", label: "Paragraph 5", rows: 2 },
        ]}
      />

      <SectionCard
        title="Craft Heritage of Kashmir"
        description='The body text under the "Craft Heritage of Kashmir" heading. Leave blank to hide the section.'
        section="craftHeritage"
        defaultValues={{
          body: content.craftHeritage.body,
        }}
        fields={[
          { name: "body", label: "Body Text", rows: 8 },
        ]}
      />
    </div>
  );
}
