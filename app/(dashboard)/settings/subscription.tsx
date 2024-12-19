"use client";

import React, { useEffect, useState } from "react";

const SubscriptionComponent = () => {
  const [paypalLoaded, setPaypalLoaded] = useState(false);
  const [renderedButtons, setRenderedButtons] = useState({});

  const tiers = [
    {
      title: "Basic",
      price: "$120/month",
      description: "Access basic premium features.",
    },
    {
      title: "Pro",
      price: "$1000/3months",
      description: "Access all standard premium features.",
    },
    {
      title: "Enterprise",
      price: "$2000/year",
      description: "Access all features and priority support.",
    },
  ];

  const addPayPalScript = () => {
    if (!document.querySelector("script[src*='paypal.com']")) {
      const script = document.createElement("script");
      script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&components=buttons&currency=USD`;
      script.type = "text/javascript";
      script.async = true;
      script.onload = () => setPaypalLoaded(true);
      script.onerror = () => console.error("Failed to load PayPal script.");
      document.body.appendChild(script);
    }
  };

  useEffect(() => {
    addPayPalScript();
  }, []);

  const handleSubscription = (plan) => {
    if (!paypalLoaded) return;

    window.paypal
      .Buttons({
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: plan === "Basic" ? "120" : plan === "Pro" ? "1000" : "2000",
                  currency_code: "USD",
                },
              },
            ],
          });
        },
        onApprove: (data, actions) => {
          return actions.order.capture().then((details) => {
            alert(`Subscription successful! Thank you, ${details.payer.name.given_name}.`);
          });
        },
        onError: (err) => {
          console.error("PayPal error:", err);
          alert("Something went wrong with your subscription. Please try again.");
        },
      })
      .render(`#paypal-button-container-${plan}`);

    setRenderedButtons((prev) => ({ ...prev, [plan]: true }));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-black px-4 lg:px-16 xl:px-32">
      <h1 className="text-4xl font-bold mb-12 text-center">Choose Your Subscription Plan</h1>
      {!paypalLoaded && <p>Loading payment options...</p>}
      <div className="flex flex-wrap justify-center gap-8">
        {tiers.map((tier, index) => (
          <div
            key={index}
            className="bg-gray-100 text-black rounded-lg shadow-lg p-6 w-full sm:w-96 md:w-[350px] lg:w-[380px] xl:w-[420px] text-center border border-gray-300 hover:shadow-2xl hover:scale-105 transition-transform"
          >
            <h2 className="text-2xl font-semibold mb-4">{tier.title}</h2>
            <p className="text-3xl font-bold mb-4">{tier.price}</p>
            <p className="text-gray-600 mb-6">{tier.description}</p>
            <div
              id={`paypal-button-container-${tier.title}`}
              className="mb-4"
            >
              {!renderedButtons[tier.title] && (
                <button
                  onClick={() => handleSubscription(tier.title)}
                  className="block bg-gradient-to-r from-purple-500 to-blue-500 text-white py-2 px-4 rounded-lg font-medium hover:brightness-110 transition-transform"
                  role="button"
                  aria-label={`Subscribe to ${tier.title}`}
                >
                  Pay with PayPal
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionComponent;
