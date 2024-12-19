CREATE TABLE IF NOT EXISTS "user_subscription" (
	"user_id" text PRIMARY KEY NOT NULL,
	"subscription_tier" text DEFAULT 'Free' NOT NULL
);
