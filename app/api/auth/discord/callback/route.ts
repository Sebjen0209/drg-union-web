import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state'); // This is the token from initiate-link

  if (!code || !state) {
    return NextResponse.redirect(new URL('/error?message=Missing code or state', request.url));
  }

  try {
    // Exchange the code for Discord user info
    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID!,
        client_secret: process.env.DISCORD_CLIENT_SECRET!,
        grant_type: 'authorization_code',
        code,
        redirect_uri: process.env.NEXT_PUBLIC_DISCORD_REDIRECT_URI!,
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange code for token');
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Get Discord user info
    const userResponse = await fetch('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!userResponse.ok) {
      throw new Error('Failed to fetch Discord user');
    }

    const discordUser = await userResponse.json();

    // Call your backend to complete the link
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const completeResponse = await fetch(`${apiUrl}/v1/users/complete-link`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: state, // The token from initiate-link
        discord_id: discordUser.id,
        discord_username: discordUser.username,
      }),
    });

    if (!completeResponse.ok) {
      const errorData = await completeResponse.json();
      throw new Error(errorData.error || 'Failed to complete link');
    }

    const result = await completeResponse.json();

    // Redirect to success page with user_id
    return NextResponse.redirect(
      new URL(`/success?user_id=${result.user_id}`, request.url)
    );
  } catch (error) {
    console.error('Discord OAuth error:', error);
    return NextResponse.redirect(
      new URL(`/error?message=${encodeURIComponent((error as Error).message)}`, request.url)
    );
  }
}