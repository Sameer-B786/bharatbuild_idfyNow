"use client";

import Link from 'next/link';
import { BookOpen, Ticket } from 'lucide-react';

export default function WorkspaceSelect() {
  return (
    <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center p-6">
      <div className="w-full max-w-4xl space-y-10 bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100 text-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Welcome Back</h2>
          <p className="text-gray-500 mt-2 text-lg">How would you like to use the platform today?</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <Link 
            href="/dashboard"
            className="flex flex-col items-center p-8 bg-white border-2 border-gray-100 hover:border-orange-500 hover:bg-orange-50 hover:shadow-md rounded-2xl transition-all group"
          >
            <div className="h-16 w-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
               <BookOpen className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">IDfyNow</h3>
            <p className="text-gray-500 text-sm">Handle sections and attendance as a faculty member.</p>
          </Link>

          <Link 
            href="/idgen"
            className="flex flex-col items-center p-8 bg-white border-2 border-gray-100 hover:border-purple-500 hover:bg-purple-50 hover:shadow-md rounded-2xl transition-all group"
          >
            <div className="h-16 w-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
               <Ticket className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">IDGen</h3>
            <p className="text-gray-500 text-sm">Want to create ID cards for institution and entry pass for events.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
