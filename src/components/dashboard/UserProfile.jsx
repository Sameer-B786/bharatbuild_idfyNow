"use client";

import { useState, useRef } from "react";
import { BadgeCheck, Camera, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function UserProfile({ initialData }) {
  const [data, setData] = useState(initialData);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState(initialData.profilePicUrl);
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const isVerified = data.verificationStatus === 'verified';
  const isPending = data.verificationStatus === 'pending';

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
      setIsEditing(true); // Automatically switch to edit mode if they change pic
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('nameAsPerInst', data.nameAsPerInst);
      formData.append('institute', data.institute);
      formData.append('expertise', data.expertise);
      
      if (selectedFile) {
        formData.append('profilePic', selectedFile);
      }

      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to update profile');
      }
      
      const responseData = await res.json();
      if (responseData.profilePicUrl) {
        setPreviewImage(responseData.profilePicUrl);
        setData(prev => ({ ...prev, profilePicUrl: responseData.profilePicUrl }));
      }
      
      setIsEditing(false);
      setSelectedFile(null);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error(error);
      alert('Error updating profile: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setData(initialData);
    setPreviewImage(initialData.profilePicUrl);
    setSelectedFile(null);
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-3xl p-8 border shadow-sm relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-orange-100 to-orange-50 z-0" />

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
          {/* Profile Picture */}
          <div className="relative group">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-md bg-gray-100 flex items-center justify-center">
              {previewImage ? (
                <img src={previewImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl text-gray-400 font-bold">
                  {data.name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              )}
            </div>
            
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-1 right-1 bg-white p-2 rounded-full shadow-md border text-gray-600 hover:text-orange-600 hover:border-orange-200 transition-colors"
            >
              <Camera className="w-4 h-4" />
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-2xl font-bold text-gray-900 capitalize">{data.name}</h2>
              {isVerified && (
                <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2.5 py-1 rounded-full text-xs font-semibold border border-green-200">
                  <BadgeCheck className="w-4 h-4" />
                  Verified
                </div>
              )}
              {isPending && (
                <div className="bg-yellow-50 text-yellow-700 px-2.5 py-1 rounded-full text-xs font-semibold border border-yellow-200">
                  Verification Pending
                </div>
              )}
            </div>
            <p className="text-gray-500">{data.email}</p>
          </div>

          {!isEditing && (
            <Button onClick={() => setIsEditing(true)} variant="outline" className="shrink-0 rounded-xl">
              Edit Profile
            </Button>
          )}
        </div>

        {/* Profile Details Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input 
              id="name" 
              name="name" 
              value={data.name} 
              onChange={handleChange} 
              disabled={!isEditing}
              className={!isEditing ? "bg-gray-50 text-gray-700" : ""}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input 
              id="email" 
              value={data.email} 
              disabled
              className="bg-gray-50 text-gray-500 cursor-not-allowed"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nameAsPerInst">Name (as per Institution)</Label>
            <Input 
              id="nameAsPerInst" 
              name="nameAsPerInst" 
              value={data.nameAsPerInst} 
              onChange={handleChange} 
              disabled={!isEditing}
              className={!isEditing ? "bg-gray-50 text-gray-700" : ""}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="institute">Institute Name</Label>
            <Input 
              id="institute" 
              name="institute" 
              value={data.institute} 
              onChange={handleChange} 
              disabled={!isEditing}
              className={!isEditing ? "bg-gray-50 text-gray-700" : ""}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="expertise">Subject Expertise</Label>
            <Input 
              id="expertise" 
              name="expertise" 
              value={data.expertise} 
              onChange={handleChange} 
              disabled={!isEditing}
              className={!isEditing ? "bg-gray-50 text-gray-700" : ""}
            />
          </div>
        </div>

        {isEditing && (
          <div className="flex justify-end gap-3 mt-8 pt-6 border-t">
            <Button variant="outline" onClick={handleCancel} disabled={isSubmitting} className="rounded-xl">
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSubmitting} className="rounded-xl bg-orange-600 hover:bg-orange-700">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
