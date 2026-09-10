import { ScanLine } from 'lucide-react';

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center items-center gap-2 text-2xl font-bold text-orange-600 mb-6">
          <ScanLine className="h-8 w-8" />
          IDfyNow
        </div>
        <h2 className="mt-2 text-center text-3xl font-bold tracking-tight text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <a href="#" className="font-medium text-orange-600 hover:text-orange-500">
            register for a new faculty account
          </a>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-2xl sm:px-10 border border-gray-100">
          {children}
        </div>
      </div>
    </div>
  );
}
