import { StatCard } from "@/components/dashboard/StatCard";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SectionCard } from "@/components/sections/SectionCard";
import { Users, LayoutGrid, Calendar, Percent, Code2, Bell, Cpu, FileText, Plus, ScanLine, FilePlus, Settings, MoreVertical, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Dashboard() {
  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-3xl p-8 flex justify-between items-center relative overflow-hidden border border-orange-100">
        <div className="relative z-10">
          <h2 className="text-2xl font-bold text-gray-900">Good Morning,</h2>
          <h1 className="text-4xl font-extrabold text-orange-600 mt-1">Prof. Sharma</h1>
          <p className="text-gray-600 mt-3 max-w-md">
            Manage your classes, take attendance and keep track of your students — all in one place.
          </p>
        </div>
        
        {/* Quote floating card */}
        <div className="hidden lg:flex items-center gap-3 bg-white/80 backdrop-blur-md px-5 py-3 rounded-2xl shadow-sm z-10 border border-white">
          <div className="bg-orange-100 p-2 rounded-lg text-orange-600">
            <ScanLine className="w-5 h-5" />
          </div>
          <p className="text-sm font-medium text-gray-700 italic">&quot;Technology makes<br/>attendance effortless.&quot;</p>
        </div>

        {/* Decorative elements - using pseudo-like divs to mimic the background waves in the image */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-orange-200/50 to-transparent z-0 pointer-events-none" />
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Sections" value="5" trend="up" trendValue="+1 this month" icon={LayoutGrid} />
        <StatCard title="Total Students" value="238" trend="up" trendValue="+12 this month" icon={Users} />
        <StatCard title="Attendance Sessions" value="42" trend="up" trendValue="+8 this month" icon={Calendar} />
        <StatCard title="Today's Attendance" value="91%" trend="up" trendValue="+5% from yesterday" icon={Percent} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column (Sections & Recent Activity) */}
        <div className="xl:col-span-2 space-y-8">
          
          {/* Sections */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Your Sections</h3>
              <Link href="/dashboard/sections" className="text-sm font-medium text-orange-600 hover:text-orange-700">View All →</Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <SectionCard 
                title="B.E CSE - A" subtitle="Computer Science" students={48} sem={4} status="Excel Connected" 
                icon={Code2} iconBg="bg-blue-50" iconColor="text-blue-500" 
              />
              <SectionCard 
                title="B.E CSE - B" subtitle="Computer Science" students={48} sem={4} status="Excel Connected" 
                icon={Bell} iconBg="bg-purple-50" iconColor="text-purple-500" 
              />
              <SectionCard 
                title="B.E ECE - A" subtitle="Electronics" students={42} sem={4} status="Excel Connected" 
                icon={Cpu} iconBg="bg-emerald-50" iconColor="text-emerald-500" 
              />
              <SectionCard 
                title="B.E ME - A" subtitle="Mechanical" students={35} sem={4} status="Excel Connected" 
                icon={FileText} iconBg="bg-rose-50" iconColor="text-rose-500" 
              />
              <SectionCard 
                title="B.E CSE - C" subtitle="Computer Science" students={44} sem={4} status="File Pending" 
                icon={FileText} iconBg="bg-amber-50" iconColor="text-amber-500" 
              />
              
              {/* Create New Section Card */}
              <Link href="/dashboard/sections/create" className="border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center p-6 text-center hover:border-orange-300 hover:bg-orange-50/50 transition-colors cursor-pointer group">
                <div className="p-3 bg-orange-50 text-orange-500 rounded-xl mb-3 group-hover:bg-orange-100 transition-colors">
                  <Plus className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-gray-900">Create New Section</h4>
                <p className="text-sm text-gray-500 mt-1 mb-4">Add a new class/section and upload student data.</p>
                <div className="border border-orange-200 text-orange-600 group-hover:bg-orange-50 group-hover:text-orange-700 w-full rounded-xl flex flex-row items-center justify-center gap-2 py-2 text-sm font-medium transition-colors">
                  <Plus className="w-4 h-4 shrink-0" />
                  <span>Create Section</span>
                </div>
              </Link>
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
              <Link href="/dashboard/attendance/history" className="text-sm font-medium text-orange-600 hover:text-orange-700">View All →</Link>
            </div>
            <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50/50 text-gray-500 font-medium border-b">
                  <tr>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Section</th>
                    <th className="px-6 py-4">Action</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr className="hover:bg-gray-50/50">
                    <td className="px-6 py-4 text-gray-600">Apr 22, 2025</td>
                    <td className="px-6 py-4 font-medium text-gray-900">CSE - A</td>
                    <td className="px-6 py-4 text-gray-600">Attendance Submitted</td>
                    <td className="px-6 py-4"><span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-medium">Completed</span></td>
                    <td className="px-6 py-4 text-right">
                       <DropdownMenu>
                         <DropdownMenuTrigger asChild>
                           <button className="focus:outline-none">
                             <MoreVertical className="w-4 h-4 text-gray-400 inline-block cursor-pointer" />
                           </button>
                         </DropdownMenuTrigger>
                         <DropdownMenuContent align="end" className="w-32 rounded-xl">
                           <DropdownMenuItem>View Details</DropdownMenuItem>
                         </DropdownMenuContent>
                       </DropdownMenu>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50/50">
                    <td className="px-6 py-4 text-gray-600">Apr 21, 2025</td>
                    <td className="px-6 py-4 font-medium text-gray-900">ECE - A</td>
                    <td className="px-6 py-4 text-gray-600">Excel File Uploaded</td>
                    <td className="px-6 py-4"><span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-medium">Completed</span></td>
                    <td className="px-6 py-4 text-right">
                       <DropdownMenu>
                         <DropdownMenuTrigger asChild>
                           <button className="focus:outline-none">
                             <MoreVertical className="w-4 h-4 text-gray-400 inline-block cursor-pointer" />
                           </button>
                         </DropdownMenuTrigger>
                         <DropdownMenuContent align="end" className="w-32 rounded-xl">
                           <DropdownMenuItem>View Details</DropdownMenuItem>
                         </DropdownMenuContent>
                       </DropdownMenu>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50/50">
                    <td className="px-6 py-4 text-gray-600">Apr 20, 2025</td>
                    <td className="px-6 py-4 font-medium text-gray-900">ECE - B</td>
                    <td className="px-6 py-4 text-gray-600">Attendance Submitted</td>
                    <td className="px-6 py-4"><span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-medium">Completed</span></td>
                    <td className="px-6 py-4 text-right">
                       <DropdownMenu>
                         <DropdownMenuTrigger asChild>
                           <button className="focus:outline-none">
                             <MoreVertical className="w-4 h-4 text-gray-400 inline-block cursor-pointer" />
                           </button>
                         </DropdownMenuTrigger>
                         <DropdownMenuContent align="end" className="w-32 rounded-xl">
                           <DropdownMenuItem>View Details</DropdownMenuItem>
                         </DropdownMenuContent>
                       </DropdownMenu>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50/50">
                    <td className="px-6 py-4 text-gray-600">Apr 19, 2025</td>
                    <td className="px-6 py-4 font-medium text-gray-900">ME - A</td>
                    <td className="px-6 py-4 text-gray-600">Section Created</td>
                    <td className="px-6 py-4"><span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-medium">Completed</span></td>
                    <td className="px-6 py-4 text-right">
                       <DropdownMenu>
                         <DropdownMenuTrigger asChild>
                           <button className="focus:outline-none">
                             <MoreVertical className="w-4 h-4 text-gray-400 inline-block cursor-pointer" />
                           </button>
                         </DropdownMenuTrigger>
                         <DropdownMenuContent align="end" className="w-32 rounded-xl">
                           <DropdownMenuItem>View Details</DropdownMenuItem>
                         </DropdownMenuContent>
                       </DropdownMenu>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Take Attendance Promo Card */}
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-3xl p-8 border border-orange-100 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 opacity-10">
              <ScanLine className="w-40 h-40" />
            </div>
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Take Attendance<br/>in Seconds</h3>
              <p className="text-sm text-gray-600 mb-6 max-w-[200px]">
                Select a section, scan student ID and mark attendance effortlessly.
              </p>
              <Button asChild className="bg-orange-500 hover:bg-orange-600 text-white rounded-full p-0 shadow-md shadow-orange-200 mt-4 w-max">
                <Link href="/dashboard/attendance" className="flex flex-row items-center justify-center gap-2 px-6 py-2">
                  <span>Start Attendance</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link href="/dashboard/sections/create" className="flex items-center p-4 bg-white border rounded-2xl hover:border-orange-200 hover:shadow-sm transition-all group">
                <div className="p-3 bg-orange-50 text-orange-500 rounded-xl mr-4 group-hover:bg-orange-100">
                  <FilePlus className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 text-sm">Create Section</h4>
                  <p className="text-xs text-gray-500 mt-0.5">Add a new class/section with student data</p>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-orange-500" />
              </Link>

              <Link href="/dashboard/attendance" className="flex items-center p-4 bg-white border rounded-2xl hover:border-orange-200 hover:shadow-sm transition-all group">
                <div className="p-3 bg-orange-50 text-orange-500 rounded-xl mr-4 group-hover:bg-orange-100">
                  <ScanLine className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 text-sm">Take Attendance</h4>
                  <p className="text-xs text-gray-500 mt-0.5">Scan student ID cards and mark attendance</p>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-orange-500" />
              </Link>

              <Link href="/dashboard/sections" className="flex items-center p-4 bg-white border rounded-2xl hover:border-orange-200 hover:shadow-sm transition-all group">
                <div className="p-3 bg-orange-50 text-orange-500 rounded-xl mr-4 group-hover:bg-orange-100">
                  <Settings className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 text-sm">Manage Sections</h4>
                  <p className="text-xs text-gray-500 mt-0.5">View, edit and manage your sections</p>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-orange-500" />
              </Link>
            </div>
          </div>

          {/* Bottom IDfyNow Logo/Ad area */}
          <div className="bg-gradient-to-br from-white to-orange-50 rounded-3xl p-6 border flex flex-col items-center justify-center text-center mt-8 shadow-sm">
            <div className="flex items-center gap-2 text-xl font-bold text-orange-600 mb-2">
               <ScanLine className="w-6 h-6" /> IDfyNow
            </div>
            <p className="text-xs text-gray-400 font-medium tracking-widest uppercase">Fast • Secure • Reliable</p>
          </div>
        </div>
      </div>
    </div>
  );
}
