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
import { FileUp, ShieldCheck } from "lucide-react";

export function FacultyVerificationModal({ isOpen, onOpenChange, onComplete }) {
  const [formData, setFormData] = useState({
    name: "",
    institute: "",
    expertise: "",
    proofFile: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, proofFile: e.target.files[0] }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.institute || !formData.expertise || !formData.proofFile) {
      alert("Please fill all the required fields and upload the proof.");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('institute', formData.institute);
      data.append('expertise', formData.expertise);
      data.append('proofFile', formData.proofFile);

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
          <div className="mx-auto w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-4">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <DialogTitle className="text-center text-2xl">Faculty Verification</DialogTitle>
          <DialogDescription className="text-center">
            Welcome! As this is your first time signing in, please provide your details to verify your faculty status.
          </DialogDescription>
        </DialogHeader>

        <form autoComplete="off" onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name (as per institution) <span className="text-red-500">*</span></Label>
            <Input
              id="name"
              name="name"
              placeholder="e.g. Dr. Jane Doe"
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
              placeholder="e.g. National Institute of Technology"
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
              placeholder="e.g. Computer Science, Mathematics"
              value={formData.expertise}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2 pt-2">
            <Label htmlFor="proofFile">Proof of Faculty (PDF only) <span className="text-red-500">*</span></Label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:bg-gray-50 transition-colors">
              <div className="space-y-1 text-center">
                <FileUp className="mx-auto h-8 w-8 text-gray-400" />
                <div className="flex text-sm text-gray-600 justify-center">
                  <label
                    htmlFor="proofFile"
                    className="relative cursor-pointer rounded-md bg-transparent font-medium text-orange-600 hover:text-orange-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-orange-500"
                  >
                    <span>Upload a file</span>
                    <Input
                      id="proofFile"
                      name="proofFile"
                      type="file"
                      accept="application/pdf,image/jpeg,image/png"
                      className="sr-only"
                      onChange={handleFileChange}
                      required
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  {formData.proofFile ? formData.proofFile.name : "PDF, PNG, or JPG (up to 5MB)"}
                </p>
              </div>
            </div>
            <p className="text-xs text-amber-600 mt-2 bg-amber-50 p-2 rounded-lg border border-amber-200">
              ⚠️ <strong>Caution:</strong> Please ensure the document is high resolution and clearly readable. Our automated system will scan this document to verify your details instantly.
            </p>
          </div>

          <DialogFooter className="pt-4">
            <Button 
              type="submit" 
              className="w-full bg-orange-600 hover:bg-orange-700 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit for Verification"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
