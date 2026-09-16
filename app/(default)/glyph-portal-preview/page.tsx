import GlyphPortalDemo from "@/components/glyph-portal-demo";

export const metadata = {
  title: "Preview — Glyph Portal",
};

export default function GlyphPortalPreviewPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <GlyphPortalDemo />
    </div>
  );
}
