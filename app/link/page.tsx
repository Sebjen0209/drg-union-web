import { Suspense } from 'react';
import LinkContent from './linkContent';

export default function LinkPage() {
  // Server component - has access to env vars
  const config = {
    discordClientId: process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID!,
    discordRedirectUri: process.env.NEXT_PUBLIC_DISCORD_REDIRECT_URI!,
  };

  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white">Loading...</div>
      </div>
    }>
      <LinkContent config={config} />
    </Suspense>
  );
}