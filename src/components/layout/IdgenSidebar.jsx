"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Ticket, BadgeCheck, LogOut, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

export function IdgenSidebar({ userName = "Organiser" }) {
  const pathname = usePathname();

  const navigation = [
    { name: 'Home', href: '/idgen', icon: Home },
    { name: 'Event Passes', href: '/idgen/event-pass', icon: Ticket },
    { name: 'Educational ID Cards', href: '/idgen/id-card', icon: BadgeCheck },
  ];

  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  return (
    <div className="hidden md:flex flex-col w-64 bg-white border-r min-h-screen">
      <div className="flex items-center h-16 px-6 font-bold text-xl text-purple-600 gap-2">
        <img src="https://share.google/jOVeMwu4eRBF9zfhA" alt="IDfyNow Logo" className="h-8 w-8 object-contain" />
        IDGen
      </div>
      
      <nav className="flex-1 px-4 py-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '?');
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center px-4 py-3 text-sm font-medium rounded-full transition-colors',
                isActive
                  ? 'bg-purple-50 text-purple-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <item.icon className={cn("mr-3 h-5 w-5", isActive ? "text-purple-600" : "text-gray-400")} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto">
        <Link href="/workspace-select" className="flex items-center text-sm text-gray-500 hover:text-gray-900 mb-4 px-2 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Switch Workspace
        </Link>
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl mb-2">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate capitalize">{userName}</p>
            <p className="text-xs text-gray-500 truncate">Organiser</p>
          </div>
        </div>
        <button onClick={handleLogout} className="flex w-full items-center px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
          <LogOut className="mr-3 h-5 w-5 text-gray-400" />
          Logout
        </button>
      </div>
    </div>
  );
}
