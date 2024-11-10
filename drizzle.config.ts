import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

// Load environment variables from .env.local
config({ path: ".env.local" });

export default defineConfig({
  schema: "./db/schema.ts",
  // Ensure this matches the actual dialect
  dialect: "postgresql", 
  // Use dbCredentials to define database connection parameters
  dbCredentials: {
    host: process.env.DB_HOST || "localhost", // Default to localhost if not defined
    port: Number(process.env.DB_PORT) || 5432, // Default PostgreSQL port
    user: process.env.DB_USER || "postgres", // Default to postgres user
    password: process.env.DB_PASSWORD || "", // Ensure this is defined in .env
    database: process.env.DB_NAME || "financialTracker", // Ensure this is defined in .env 
    ssl: process.env.DB_SSL === "true", // Convert string to boolean
  },
  verbose: true,
  strict: true,
});
