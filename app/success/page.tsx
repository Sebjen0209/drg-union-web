'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const userId = searchParams.get('user_id');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl max-w-md w-full text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-3xl font-bold text-green-500 mb-4">Rock and Stone!</h1>
        <p className="text-gray-300 mb-6">
          Your Discord account has been successfully linked!
        </p>
        {userId && (
          <div className="bg-gray-700 p-4 rounded-lg mb-4">
            <p className="text-sm text-gray-400">User ID</p>
            <p className="text-white font-mono">{userId}</p>
          </div>
        )}
        <p className="text-gray-400 text-sm">
          You can now close this window and return to the game.
        </p>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-900"><div className="text-white">Loading...</div></div>}>
      <SuccessContent />
    </Suspense>
  );
}