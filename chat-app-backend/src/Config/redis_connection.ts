import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

export const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://127.0.0.1:6379",
});

redisClient.on("error", (err) => {
  console.error("❌ Redis Connection Error:", err);
});

redisClient.on("connect", () => {
  console.log("✅ Connected to Redis");
});

(async () => {
  await redisClient.connect();
})();