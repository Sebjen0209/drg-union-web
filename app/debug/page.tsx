export default function DebugPage() {
  return (
    <div className="p-8 bg-gray-900 text-white min-h-screen">
      <h1 className="text-2xl mb-4">Environment Variables Debug</h1>
      <pre className="bg-gray-800 p-4 rounded">
        {JSON.stringify({
          NEXT_PUBLIC_DISCORD_CLIENT_ID: process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID,
          NEXT_PUBLIC_DISCORD_REDIRECT_URI: process.env.NEXT_PUBLIC_DISCORD_REDIRECT_URI,
          NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
          NEXT_PUBLIC_GSG_GUILD_ID: process.env.NEXT_PUBLIC_GSG_GUILD_ID,
        }, null, 2)}
      </pre>
    </div>
  );
}