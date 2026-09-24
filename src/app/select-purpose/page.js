import Link from 'next/link';

export default function SelectPurposePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Select Purpose</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        <Link 
          href="/generator/id-card"
          className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-200 flex flex-col items-center text-center group"
        >
          <div className="h-16 w-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
             <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
             </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Educational ID Cards</h2>
          <p className="text-gray-500">Generate ID cards for K-12 students, UG/PG students, and Faculty.</p>
        </Link>
        
        <Link 
          href="/generator/event-pass"
          className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-200 flex flex-col items-center text-center group"
        >
          <div className="h-16 w-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
             <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
             </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Event Passes</h2>
          <p className="text-gray-500">Generate customized event badges for hosts, volunteers, and attendees.</p>
        </Link>
      </div>
    </div>
  );
}
