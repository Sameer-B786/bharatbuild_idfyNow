"use client";

import { useState } from "react";
import { FacultyVerificationModal } from "./FacultyVerificationModal";

export function FacultyVerificationWrapper({ isVerified }) {
  const [isOpen, setIsOpen] = useState(!isVerified);

  const handleComplete = () => {
    setIsOpen(false);
    window.location.reload();
  };

  if (isVerified && !isOpen) {
    return null;
  }

  return (
    <>
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="mt-6 px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-medium transition-colors"
        >
          Verify Now
        </button>
      )}
      <FacultyVerificationModal 
        isOpen={isOpen} 
        onOpenChange={setIsOpen} 
        onComplete={handleComplete} 
      />
    </>
  );
}
