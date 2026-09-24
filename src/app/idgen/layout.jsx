import { IdgenSidebar } from '@/components/layout/IdgenSidebar';
import { IdgenTopbar } from '@/components/layout/IdgenTopbar';
import { getSession } from "@/lib/session";

export default async function IdgenLayout({ children }) {
  const session = await getSession();
  const userName = session?.userInfo?.name || session?.userInfo?.email?.split('@')[0] || "User";

  return (
    <div className="flex min-h-screen bg-[#FDFDFD]">
      <IdgenSidebar userName={userName} />
      <div className="flex-1 flex flex-col">
        <IdgenTopbar userName={userName} />
        <main className="flex-1 p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
