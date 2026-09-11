"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, PlusSquare, LayoutGrid, ScanLine, Clock, User, LogOut, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Sidebar({ userName = "Prof. Sharma" }) {
  const pathname = usePathname();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Analyse Attendance', href: '/dashboard/analyse', icon: BarChart3 },
    { name: 'Create Section', href: '/dashboard/sections/create', icon: PlusSquare },
    { name: 'Manage Sections', href: '/dashboard/sections', icon: LayoutGrid },
    { name: 'Take Attendance', href: '/dashboard/attendance', icon: ScanLine },
  ];

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/login';
  };

  return (
    <div className="hidden md:flex flex-col w-64 bg-white border-r min-h-screen">
      <div className="flex items-center h-16 px-6 font-bold text-xl text-orange-600 gap-2">
        <ScanLine className="h-6 w-6" />
        IDfyNow
      </div>
      
      <nav className="flex-1 px-4 py-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center px-4 py-3 text-sm font-medium rounded-full transition-colors',
                isActive
                  ? 'bg-orange-50 text-orange-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <item.icon className={cn("mr-3 h-5 w-5", isActive ? "text-orange-600" : "text-gray-400")} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto">
        <div className="mb-4 px-2">
          <p className="text-xs font-semibold text-gray-500">Smarter Attendance</p>
          <p className="text-xs text-gray-400">for a Brighter Tomorrow</p>
        </div>
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl mb-2">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate capitalize">{userName}</p>
            <p className="text-xs text-gray-500 truncate">Faculty</p>
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
