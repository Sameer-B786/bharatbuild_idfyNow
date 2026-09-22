import { getSession } from "@/lib/session";
import { CognitoIdentityProviderClient, GetUserCommand } from '@aws-sdk/client-cognito-identity-provider';
import { UserProfile } from "@/components/dashboard/UserProfile";

const REGION = process.env.COGNITO_REGION || 'ap-south-1';

export default async function ProfilePage() {
  const session = await getSession();
  const email = session?.userInfo?.email;
  const accessToken = session?.accessToken;

  if (!email) {
    return <div>Not logged in</div>;
  }

  let profileData = {
    email: email,
    name: session?.userInfo?.name || '',
    nameAsPerInst: '',
    institute: '',
    expertise: '',
    verificationStatus: 'unverified',
    profilePicUrl: ''
  };

  if (accessToken) {
    try {
      const client = new CognitoIdentityProviderClient({ region: REGION });
      const command = new GetUserCommand({
        AccessToken: accessToken,
      });
      const response = await client.send(command);
      
      const getAttr = (name) => {
        const attr = response.UserAttributes?.find(a => a.Name === name);
        return attr ? attr.Value : '';
      };

      profileData.name = getAttr('name') || profileData.name;
      profileData.nameAsPerInst = getAttr('custom:name_as_per_inst');
      profileData.institute = getAttr('custom:institute');
      profileData.expertise = getAttr('custom:expertise');
      profileData.verificationStatus = getAttr('custom:verification_status') || 'unverified';
      profileData.profilePicUrl = getAttr('picture');

    } catch (error) {
      console.error("Error fetching user profile:", error.message);
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">User Profile</h1>
        <p className="text-gray-500 mt-2">Manage your personal and institution details.</p>
      </div>

      <UserProfile initialData={profileData} />
    </div>
  );
}
