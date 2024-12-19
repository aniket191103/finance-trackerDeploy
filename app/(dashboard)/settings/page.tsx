'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SubscriptionComponent from './subscription';

export default function SettingsPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect the user after 3 seconds
    const timer = setTimeout(() => {
      router.push('/'); // Main page or homepage
    }, 3000);

    return () => clearTimeout(timer); // Clean up on unmount
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="text-center max-w-md mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-semibold text-gray-800 mb-4">
          Page Under Development
        </h1>
        <p className="text-gray-600 mb-6">
          Hi! This page is currently under development. While we work on it, feel free to enjoy the rest of the features.
        </p>
        <p className="text-sm text-gray-500 mb-6">
          You will be redirected to the main page in 3 seconds...
        </p>
        <button
          onClick={() => router.push('/')}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
        >
          Go to Main Page
        </button>
      </div>


      <div>
        {/* <SubscriptionComponent/> */}
      </div>
    </div>
  );
}
