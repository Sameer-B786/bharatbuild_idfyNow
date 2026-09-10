import { Search, Menu } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Sidebar } from './Sidebar';

export function Topbar() {
  return (
    <header className="flex h-16 items-center justify-between px-4 md:px-8 bg-white/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="flex items-center gap-4 flex-1">
        <Sheet>
          <SheetTrigger className="md:hidden p-2 -ml-2 text-gray-500 hover:text-gray-700">
            <Menu className="h-6 w-6" />
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <div className="flex w-full h-full">
              <Sidebar className="w-full flex md:flex border-r-0" />
            </div>
          </SheetContent>
        </Sheet>
        
        <div className="flex-1 max-w-md relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            type="search" 
            placeholder="Search sections, students..." 
            className="w-full pl-10 bg-white border-none rounded-full shadow-sm"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden shrink-0">
             {/* eslint-disable-next-line @next/next/no-img-element */}
             <img src="/placeholder-user.jpg" alt="Prof. Sharma" className="h-full w-full object-cover" />
          </div>
          <div className="hidden md:block text-sm">
            <p className="font-medium text-gray-900 leading-none">Prof. Sharma</p>
            <p className="text-xs text-gray-500 mt-1">Faculty</p>
          </div>
        </div>
      </div>
    </header>
  );
}
