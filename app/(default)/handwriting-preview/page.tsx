import HandwritingTextDemo from "@/components/handwriting-text-demo";

export const metadata = {
  title: "Preview — Handwriting Text",
};

export default function HandwritingPreviewPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <HandwritingTextDemo />
    </div>
  );
}
