"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BadgeCheck, Ticket, ArrowLeft, Users, GraduationCap, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function IDGenWizardPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [purpose, setPurpose] = useState(null);

  const handlePurposeSelect = (selectedPurpose) => {
    setPurpose(selectedPurpose);
    if (selectedPurpose === 'event-pass') {
      router.push('/dashboard/idgen/event-pass');
    } else {
      setStep(2);
    }
  };

  const handleAudienceSelect = (selectedAudience) => {
    router.push(`/dashboard/idgen/id-card?schema=${selectedAudience}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <div className="max-w-3xl w-full">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12 text-center relative overflow-hidden">
          
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mx-auto w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mb-6 text-orange-600">
                <BadgeCheck className="w-8 h-8" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-3">What are you generating today?</h1>
              <p className="text-gray-500 mb-10 text-lg">Select the type of credentials you need to create to get started.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <button 
                  onClick={() => handlePurposeSelect('id-card')}
                  className="flex flex-col items-center p-8 bg-white border-2 border-gray-100 hover:border-orange-500 hover:bg-orange-50 hover:shadow-md rounded-2xl transition-all group"
                >
                  <div className="h-16 w-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                     <BadgeCheck className="w-8 h-8" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Educational ID Cards</h2>
                  <p className="text-sm text-gray-500 leading-relaxed">For students, faculty, and staff members.</p>
                </button>
                
                <button 
                  onClick={() => handlePurposeSelect('event-pass')}
                  className="flex flex-col items-center p-8 bg-white border-2 border-gray-100 hover:border-purple-500 hover:bg-purple-50 hover:shadow-md rounded-2xl transition-all group"
                >
                  <div className="h-16 w-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                     <Ticket className="w-8 h-8" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Event Passes</h2>
                  <p className="text-sm text-gray-500 leading-relaxed">For event attendees, hosts, and volunteers.</p>
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500">
              <button 
                onClick={() => setStep(1)} 
                className="absolute top-8 left-8 flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-1" /> Back
              </button>
              
              <div className="mx-auto w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 text-blue-600 mt-8 md:mt-0">
                <Users className="w-8 h-8" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-3">Who are these ID cards for?</h1>
              <p className="text-gray-500 mb-10 text-lg">This helps us apply the correct strict validation rules for your data.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button 
                  onClick={() => handleAudienceSelect('k12')}
                  className="flex flex-col items-center p-6 bg-white border-2 border-gray-100 hover:border-blue-500 hover:bg-blue-50 hover:shadow-sm rounded-xl transition-all group"
                >
                  <GraduationCap className="w-8 h-8 text-blue-400 mb-3 group-hover:scale-110 transition-transform" />
                  <h2 className="text-md font-semibold text-gray-900">K-12 Students</h2>
                </button>
                <button 
                  onClick={() => handleAudienceSelect('ugpg')}
                  className="flex flex-col items-center p-6 bg-white border-2 border-gray-100 hover:border-blue-500 hover:bg-blue-50 hover:shadow-sm rounded-xl transition-all group"
                >
                  <Building2 className="w-8 h-8 text-blue-400 mb-3 group-hover:scale-110 transition-transform" />
                  <h2 className="text-md font-semibold text-gray-900">UG / PG Students</h2>
                </button>
                <button 
                  onClick={() => handleAudienceSelect('faculty')}
                  className="flex flex-col items-center p-6 bg-white border-2 border-gray-100 hover:border-blue-500 hover:bg-blue-50 hover:shadow-sm rounded-xl transition-all group"
                >
                  <Users className="w-8 h-8 text-blue-400 mb-3 group-hover:scale-110 transition-transform" />
                  <h2 className="text-md font-semibold text-gray-900">Faculty & Staff</h2>
                </button>
              </div>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
}
