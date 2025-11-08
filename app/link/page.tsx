'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { completeLink } from '@/lib/api';

export default function LinkPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'authenticating'>('loading');

  useEffect(() => {
    const token = searchParams.get('token');
    const code = searchParams.get('code');

    // Step 1: User arrives from DRG mod with token
    if (token && !code) {
      // Redirect to Discord OAuth
      const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.NEXT_PUBLIC_DISCORD_REDIRECT_URI!)}&response_type=code&scope=identify%20guilds&state=${token}`;
      window.location.href = discordAuthUrl;
      return;
    }

    // Step 2: User returns from Discord with code
    if (code) {
      handleDiscordCallback(code, searchParams.get('state'));
    }
  }, [searchParams, router]);

  async function handleDiscordCallback(code: string, token: string | null) {
    if (!token) {
      router.push('/error?message=Missing token');
      return;
    }

    setStatus('authenticating');

    try {
      // Exchange code for Discord access token
      const tokenResponse = await fetch('/api/discord-exchange', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });

      const { access_token } = await tokenResponse.json();

      // Get Discord user info
      const userResponse = await fetch('https://discord.com/api/users/@me', {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      const discordUser = await userResponse.json();

      // Check guild membership
      const guildsResponse = await fetch('https://discord.com/api/users/@me/guilds', {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      const guilds = await guildsResponse.json();

      const isInGuild = guilds.some((g: any) => g.id === process.env.NEXT_PUBLIC_GSG_GUILD_ID);

      if (!isInGuild) {
        router.push('/error?message=You must be a member of the GSG Discord server');
        return;
      }

      // Complete linking with your API
      await completeLink(token, discordUser.id);

      router.push('/success');
    } catch (err) {
      router.push('/error?message=Failed to link accounts. Please try again.');
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="text-center">
        {status === 'loading' && <p>Redirecting to Discord...</p>}
        {status === 'authenticating' && <p>Linking your accounts...</p>}
      </div>
    </div>
  );
}