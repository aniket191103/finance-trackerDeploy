import { addMonths, addYears } from "date-fns";
import { userSubscription } from "@/db/schema"; // Ensure this matches your schema file and field names
import { db } from "@/db/drizzle";
import { eq } from "drizzle-orm";

/**
 * Updates the subscription dates in the user_subscription table based on the subscription tier.
 * @param userId The ID of the user whose subscription needs to be updated.
 * @param subscriptionTier The subscription tier (Free, Basic, Premium, Enterprise).
 */
export const updateSubscriptionDates = async (userId: string, subscriptionTier: string): Promise<void> => {
    const startDate = new Date();
    let endDate: Date | null = null; // Set endDate to null initially

    // Determine the end date based on subscription tier
    switch (subscriptionTier) {
        case "Basic":
            endDate = addMonths(startDate, 1);
            break;
        case "Premium":
            endDate = addMonths(startDate, 3);
            break;
        case "Enterprise":
            endDate = addYears(startDate, 1);
            break;
        case "Free":
            // Handle Free subscription logic (e.g., no endDate or short duration)
            endDate = null; // Free subscriptions may have no expiry
            break;
        default:
            throw new Error("Invalid subscription tier");
    }

    // Check if the user already has an active subscription
    const existingSubscription = await db
        .select()
        .from(userSubscription)
        .where(eq(userSubscription.userId, userId))
        .limit(1); // Ensure to limit the query to just one record

    // If there's an existing subscription, handle the update accordingly
    if (existingSubscription.length > 0) {
        const currentSubscription = existingSubscription[0];

        // Optionally check if the subscription has expired
        if (currentSubscription.endDate && new Date(currentSubscription.endDate) < startDate) {
            console.log(`User ${userId}'s subscription has expired. Renewing subscription.`);
        } else {
            console.log(`User ${userId}'s subscription is active. Updating subscription tier.`);
        }

        // Update the subscription with the new start and end date
        await db
            .update(userSubscription)
            .set({
                startDate: startDate,
                endDate: endDate,
                subscriptionTier: subscriptionTier, // Ensure the tier is updated correctly
            })
            .where(eq(userSubscription.userId, userId));
    } else {
        // If no existing subscription, insert a new one for the user
        console.log(`No active subscription found for User ${userId}. Creating a new subscription.`);
        await db.insert(userSubscription).values({
            userId: userId,
            startDate: startDate,
            endDate: endDate,
            subscriptionTier: subscriptionTier, // Ensure subscriptionTier is included correctly
        });
    }

    console.log(`User ${userId} subscription updated to ${subscriptionTier} tier.`);
};
