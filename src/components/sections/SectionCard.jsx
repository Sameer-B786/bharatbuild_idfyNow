"use client";

import { useState } from "react";
import { MoreVertical, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function SectionCard({ title, subtitle, students, sem, status }) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  return (
    <>
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
              <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
                Edit Section
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-red-600 focus:bg-red-50 focus:text-red-700"
                onClick={() => setIsDeleteOpen(true)}
              >
                Delete
              </DropdownMenuItem>
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

      {/* Edit Section Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Section</DialogTitle>
            <DialogDescription>
              Update the details for this section. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Section Title</Label>
              <Input id="title" defaultValue={title} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="subtitle">Subtitle / Branch</Label>
              <Input id="subtitle" defaultValue={subtitle} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="students">Students</Label>
                <Input id="students" type="number" defaultValue={students} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="sem">Semester</Label>
                <Input id="sem" type="number" defaultValue={sem} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
            <Button className="bg-orange-600 hover:bg-orange-700 text-white" onClick={() => setIsEditOpen(false)}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Section Confirmation Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Section</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <span className="font-semibold text-gray-900">{title}</span>? This action cannot be undone and will remove all associated attendance records.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
            <Button variant="destructive" className="bg-red-600 hover:bg-red-700 text-white" onClick={() => setIsDeleteOpen(false)}>
              Delete Section
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
