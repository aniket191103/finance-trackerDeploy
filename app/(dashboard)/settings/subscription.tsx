"use client"; // Ensure this is a client-side component

import React, { useEffect, useState } from "react";

const SubscriptionComponent = () => {
  const [paypalLoaded, setPaypalLoaded] = useState(false);
  const [renderedButtons, setRenderedButtons] = useState({});
  // const router = useRouter(); // Use router for navigation after success

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

    if (process.env.NEXT_PUBLIC_NODE_ENV === "development") {
      // In development, bypass PayPal and mock the subscription
      const userId = "dev-user-id"; // Simulate a user ID in dev mode
      const startDate = new Date();
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + (plan === "Basic" ? 30 : plan === "Pro" ? 90 : 365));

      sendSubscriptionData(userId, plan, startDate, endDate); // Send data to backend
      return;
    }

    // PayPal checkout for production
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
            const userId = details.payer.payer_id;
            const startDate = new Date();
            const endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + (plan === "Basic" ? 30 : plan === "Pro" ? 90 : 365));

            sendSubscriptionData(userId, plan, startDate, endDate); // Send subscription data after success
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

  const sendSubscriptionData = async (userId, plan, startDate, endDate) => {
    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          tier: plan,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save subscription.");
      }

      // Navigate to success page after successful subscription
      // router.push("/subscription-success");
    } catch (error) {
      console.error("Subscription data send error:", error);
      alert("Failed to save subscription.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 lg:px-16 xl:px-32">
      <h1 className="text-4xl font-bold mb-12 text-center text-gray-800">Choose Your Subscription Plan</h1>
      {!paypalLoaded ? (
        <div className="flex flex-wrap justify-center gap-8">
          {tiers.map((_, index) => (
            <div
              key={index}
              className="shadow-lg hover:shadow-xl transition-shadow w-full sm:w-96 md:w-[350px] lg:w-[380px] xl:w-[420px]"
            >
              <div>
                <div className="h-8 w-1/2 mb-4 skeleton" />
                <div className="h-6 w-1/3 skeleton" />
              </div>
              <div>
                <div className="h-6 w-full mb-4 skeleton" />
                <div className="h-6 w-3/4 mb-4 skeleton" />
                <div className="flex justify-center">
                  <div className="loader" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap justify-center gap-8">
          {tiers.map((tier, index) => (
            <div
              key={index}
              className="shadow-lg hover:shadow-xl transition-shadow w-full sm:w-96 md:w-[350px] lg:w-[380px] xl:w-[420px]"
            >
              <div>
                <h2 className="text-2xl font-semibold">{tier.title}</h2>
                <p className="text-gray-500 text-lg">{tier.price}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-6">{tier.description}</p>
                <div id={`paypal-button-container-${tier.title}`} className="mb-4">
                  {!renderedButtons[tier.title] && (
                    <button
                      onClick={() => handleSubscription(tier.title)}
                      className="block bg-gradient-to-r from-purple-500 to-blue-500 text-white py-2 px-4 rounded-lg font-medium hover:brightness-110 transition-transform"
                      aria-label={`Subscribe to ${tier.title}`}
                    >
                      Pay with PayPal
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SubscriptionComponent;
