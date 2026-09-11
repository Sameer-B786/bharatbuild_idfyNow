import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { getSession } from "@/lib/session";

export default async function DashboardLayout({ children }) {
  const session = await getSession();
  const userName = session?.userInfo?.name || session?.userInfo?.email?.split('@')[0] || "User";

  return (
    <div className="flex min-h-screen bg-[#FDFDFD]">
      <Sidebar userName={userName} />
      <div className="flex-1 flex flex-col">
        <Topbar userName={userName} />
        <main className="flex-1 p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
