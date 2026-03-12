import { SessionProvider } from "./session-provider";
import { AdminShell } from "./admin-shell";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AdminShell>{children}</AdminShell>
    </SessionProvider>
  );
}
