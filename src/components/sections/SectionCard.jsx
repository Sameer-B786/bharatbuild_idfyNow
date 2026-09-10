import { MoreVertical, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function SectionCard({ title, subtitle, students, sem, status }) {
  return (
    <div className="bg-white rounded-2xl p-5 border shadow-sm flex flex-col hover:shadow-md transition-all">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="font-bold text-gray-900">{title}</h4>
          <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="text-gray-400 hover:text-gray-600 focus:outline-none">
              <MoreVertical className="w-5 h-5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40 rounded-xl">
            <DropdownMenuItem>Edit Section</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600 focus:bg-red-50 focus:text-red-700">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center text-xs text-gray-500 mt-2 gap-2">
        <div className="flex items-center">
          <Users className="w-3.5 h-3.5 mr-1" />
          {students} Students
        </div>
        <span>•</span>
        <span>Sem {sem}</span>
      </div>

      <div className="mt-4">
        <Badge variant="secondary" className={
          status === 'Excel Connected' 
            ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 font-medium' 
            : 'bg-amber-50 text-amber-600 hover:bg-amber-100 font-medium'
        }>
          {status}
        </Badge>
      </div>

      <Button asChild className="w-full mt-5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl shadow-sm p-0">
        <Link href="/dashboard/attendance" className="flex flex-row items-center justify-center gap-2 w-full h-full px-4 py-2">
          <span>Take Attendance</span>
          <ArrowRight className="w-4 h-4 shrink-0" />
        </Link>
      </Button>
    </div>
  );
}
