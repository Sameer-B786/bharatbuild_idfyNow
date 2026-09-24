"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck } from "lucide-react";

export function FacultyVerificationModal({ isOpen, onOpenChange, onComplete }) {
  const [formData, setFormData] = useState({
    name: "",
    institute: "",
    expertise: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.institute || !formData.expertise) {
      alert("Please fill all the required fields.");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('institute', formData.institute);
      data.append('expertise', formData.expertise);

      const res = await fetch('/api/user/verify', {
        method: 'POST',
        body: data,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to submit");
      }
      
      if (onComplete) {
        onComplete(formData);
      } else {
        onOpenChange(false);
      }
    } catch (error) {
      console.error("Error submitting verification:", error);
      alert("Failed to submit verification details: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent 
        className="sm:max-w-[500px]" 
        showCloseButton={false}
      >
        <DialogHeader>
          <div className="mx-auto w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-4">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <DialogTitle className="text-center text-2xl">Faculty Verification</DialogTitle>
          <DialogDescription className="text-center">
            Welcome! As this is your first time signing in, please provide your details to verify your faculty status based on your college email.
          </DialogDescription>
        </DialogHeader>

        <form autoComplete="off" onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name (as per institution) <span className="text-red-500">*</span></Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="institute">Institute Name <span className="text-red-500">*</span></Label>
            <Input
              id="institute"
              name="institute"
              value={formData.institute}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="expertise">Subject Expertise <span className="text-red-500">*</span></Label>
            <Input
              id="expertise"
              name="expertise"
              value={formData.expertise}
              onChange={handleChange}
              required
            />
          </div>

          <DialogFooter className="pt-4">
            <Button 
              type="submit" 
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Verify Details"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
