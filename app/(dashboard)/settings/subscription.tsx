'use client';

import React from 'react';

const SubscriptionComponent = () => {
  const tiers = [
    {
      title: 'Basic',
      price: '₹120/month',
      description: 'Access basic premium features.',
      link: 'https://pmny.in/PAYUMN/cIqlELfR0cAb', // Replace with your Instamojo link
    },
    {
      title: 'Pro',
      price: '₹1000/month',
      description: 'Access all standard premium features.',
      link: 'https://pmny.in/PAYUMN/pIuM8gv21FoQ', // Replace with your Instamojo link
    },
    {
      title: 'Enterprise',
      price: '₹2000/month',
      description: 'Access all features and priority support.',
      link: 'https://pmny.in/PAYUMN/WIKMNgX2WFLR', // Replace with your Instamojo link
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-black">
      <h1 className="text-4xl font-bold mb-12 text-center">Choose Your Subscription Plan</h1>
      <div className="flex  flex-wrap justify-center gap-8 px-4 lg:px-16 xl:px-32">
        {tiers.map((tier, index) => (
          <div
            key={index}
            className="bg-gray-100 text-black rounded-lg shadow-lg p-6 w-80 sm:w-96 md:w-[350px] lg:w-[380px] xl:w-[420px] text-center border border-gray-300 hover:shadow-2xl hover:scale-105 transition-transform"
          >
            <h2 className="text-2xl font-semibold mb-4">{tier.title}</h2>
            <p className="text-3xl font-bold mb-4">{tier.price}</p>
            <p className="text-gray-600 mb-6">{tier.description}</p>
            <a
              href={tier.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-gradient-to-r from-purple-500 to-blue-500 text-white py-2 px-4 rounded-lg font-medium hover:brightness-110 transition-transform"
            >
              Subscribe
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionComponent;
