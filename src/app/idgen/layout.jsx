import { IdgenSidebar } from '@/components/layout/IdgenSidebar';
import { IdgenTopbar } from '@/components/layout/IdgenTopbar';
import { getSession } from "@/lib/session";

export default async function IdgenLayout({ children }) {
  const session = await getSession();
  const userName = session?.userInfo?.name || session?.userInfo?.email?.split('@')[0] || "User";

  return (
    <div className="flex h-screen bg-[#F3F4F6] p-4 gap-4 overflow-hidden">
      <IdgenSidebar userName={userName} />
      <div className="flex-1 flex flex-col gap-4 min-w-0">
        <IdgenTopbar userName={userName} />
        <main className="flex-1 p-8 overflow-auto rounded-2xl bg-white shadow-sm border border-gray-100">
          {children}
        </main>
      </div>
    </div>
  );
}
