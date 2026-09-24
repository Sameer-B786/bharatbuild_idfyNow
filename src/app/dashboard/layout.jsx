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

  return (
    <div className="flex min-h-screen bg-[#FDFDFD]">
      <Sidebar userName={userName} />
      <div className="flex-1 flex flex-col">
        {/* <Topbar userName={userName} /> */}
        <main className="flex-1 p-8 overflow-auto">
          {!isVerified && <FacultyVerificationWrapper isVerified={isVerified} />}
          {children}
        </main>
      </div>
    </div>
  );
}
