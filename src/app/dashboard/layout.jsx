import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { getSession } from "@/lib/session";
import { CognitoIdentityProviderClient, GetUserCommand } from '@aws-sdk/client-cognito-identity-provider';
import { FacultyVerificationWrapper } from "@/components/dashboard/FacultyVerificationWrapper";
import { ShieldAlert } from 'lucide-react';

const REGION = process.env.COGNITO_REGION || 'ap-south-1';

export default async function DashboardLayout({ children }) {
  const session = await getSession();
  const userName = session?.userInfo?.name || session?.userInfo?.email?.split('@')[0] || "User";
  const accessToken = session?.accessToken;

  let isVerified = false; // Default to false to ensure security
  if (accessToken) {
    try {
      const client = new CognitoIdentityProviderClient({ region: REGION });
      const command = new GetUserCommand({
        AccessToken: accessToken,
      });
      const response = await client.send(command);
      const attributes = response.UserAttributes || [];
      const statusAttr = attributes.find(attr => attr.Name === 'custom:verification_status');
      if (statusAttr && (statusAttr.Value === 'verified' || statusAttr.Value === 'pending')) {
        isVerified = true;
      }
    } catch (error) {
      console.error("Error fetching user verification status in layout:", error.message);
    }
  }

  if (!isVerified) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <FacultyVerificationWrapper isVerified={isVerified} />
        
        <div className="text-center max-w-md space-y-4">
          <div className="mx-auto w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-6">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Verification Required</h1>
          <p className="text-gray-500">
            You must complete the faculty verification process before you can access the dashboard. Please submit your details in the popup to move forward.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#FDFDFD]">
      <Sidebar userName={userName} />
      <div className="flex-1 flex flex-col">
        <Topbar userName={userName} />
        <main className="flex-1 p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
