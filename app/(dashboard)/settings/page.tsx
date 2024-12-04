'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SubscriptionComponent from './subscription';

export default function SettingsPage() {
  const router = useRouter();

  useEffect(() => {
    const showAlert = async () => {
    //   Uncomment if needed for redirection
      const userConfirmed = window.alert(
        "Settings page is under development. You'll be redirected to the main page."
      );
      if (userConfirmed === undefined || userConfirmed === true) {
        router.push('/');
      }
    };

    // showAlert();
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="text-center mb-8 mt-16 px-4">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">Settings</h1>
        <p className="text-lg text-gray-600">
          {/* This page is currently under development. */}
        </p>
      </div>

      <div className="w-full max-w-5xl mx-auto flex flex-col items-center px-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          {/* Choose Your Subscription Plan */}
        </h2>
        <SubscriptionComponent />
      </div> 
    </div>
  );
}
