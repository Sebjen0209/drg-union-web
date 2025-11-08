import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state'); // This is the token
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.redirect(
      new URL(`/error?message=${encodeURIComponent('Discord authentication failed')}`, request.url)
    );
  }

  if (!code || !state) {
    return NextResponse.redirect(
      new URL('/error?message=Missing code or token', request.url)
    );
  }

  try {
    // Exchange Discord code for access token
    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID!,
        client_secret: process.env.DISCORD_CLIENT_SECRET!,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: process.env.NEXT_PUBLIC_DISCORD_REDIRECT_URI!,
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange Discord code for token');
    }

    const tokenData = await tokenResponse.json();

    // Get Discord user info
    const userResponse = await fetch('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    if (!userResponse.ok) {
      throw new Error('Failed to fetch Discord user info');
    }

    const discordUser = await userResponse.json();

    // Complete the link by calling your API
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const completeResponse = await fetch(`${apiUrl}/v1/users/complete-link`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: state,
        discord_id: discordUser.id,
        discord_username: discordUser.username,
        discord_discriminator: discordUser.discriminator || '0',
        discord_avatar: discordUser.avatar,
      }),
    });

    const result = await completeResponse.json();

    if (!completeResponse.ok) {
      return NextResponse.redirect(
        new URL(`/error?message=${encodeURIComponent(result.error || 'Failed to link account')}`, request.url)
      );
    }

    // Success! Redirect to success page
    return NextResponse.redirect(
      new URL(`/success?user_id=${result.user_id}`, request.url)
    );

  } catch (error) {
    console.error('Discord callback error:', error);
    return NextResponse.redirect(
      new URL(`/error?message=${encodeURIComponent('An error occurred during authentication')}`, request.url)
    );
  }
}