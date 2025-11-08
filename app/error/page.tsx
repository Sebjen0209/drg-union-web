'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function ErrorContent() {
  const searchParams = useSearchParams();
  const message = searchParams.get('message') || 'An unknown error occurred';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl max-w-md w-full text-center">
        <div className="text-6xl mb-4">❌</div>
        <h1 className="text-2xl font-bold text-red-500 mb-4">Linking Failed</h1>
        <p className="text-gray-300 mb-6">{message}</p>
        <p className="text-gray-400 text-sm">
          Please try again or contact support if the issue persists.
        </p>
      </div>
    </div>
  );
}

export default function ErrorPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-900"><div className="text-white">Loading...</div></div>}>
      <ErrorContent />
    </Suspense>
  );
}