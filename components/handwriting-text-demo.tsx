import { HandwritingText } from "@/components/ui/handwriting-text";

export default function HandwritingTextDemo() {
  return (
    <div className="flex min-h-[360px] w-full flex-col items-center justify-center gap-10 rounded-xl border border-gray-800 bg-black px-6">
      <h1 className="max-w-2xl text-center text-4xl font-bold leading-tight tracking-tight text-gray-100 sm:text-5xl">
        Know where the crowd
        <br />
        is going to break
        <br />
        <HandwritingText
          words={["live.", "predictive.", "measurable.", "on every phone."]}
          className="text-indigo-400"
          height="1.15em"
        />
      </h1>

      <p className="text-sm text-gray-500">
        Each word is traced letter by letter, then inked in.
      </p>
    </div>
  );
}
