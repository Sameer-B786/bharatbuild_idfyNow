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
    <FacultyVerificationModal 
      isOpen={isOpen} 
      onOpenChange={setIsOpen} 
      onComplete={handleComplete} 
    />
  );
}
