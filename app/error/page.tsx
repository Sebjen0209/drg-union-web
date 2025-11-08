'use client';

import { useSearchParams } from 'next/navigation';

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const message = searchParams.get('message') || 'An unknown error occurred';

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-bold mb-4 text-red-500">Error</h1>
        <p className="text-xl mb-4">{message}</p>
        <p className="text-gray-400">Please try again or contact support.</p>
      </div>
    </div>
  );
}