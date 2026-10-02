import GatewayFlowDemo from "@/components/gateway-flow-demo";

export const metadata = {
  title: "Preview — Gateway Flow",
  robots: { index: false, follow: false },
};

export default function GatewayPreviewPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <GatewayFlowDemo />
    </div>
  );
}
