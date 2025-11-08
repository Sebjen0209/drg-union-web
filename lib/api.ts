export async function completeLink(token: string, discordId: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/users/complete-link`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, discord_id: discordId }),
  });

  if (!response.ok) {
    throw new Error('Failed to complete linking');
  }

  return response.json();
}