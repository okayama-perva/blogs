import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { FloatingReserveButton } from "@/components/floating-reserve-button";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-8 lg:px-8">
        {children}
      </main>
      <Footer />
      <FloatingReserveButton />
    </>
  );
}
