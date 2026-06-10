import { createClient, RedisClientType } from "redis";
import dotenv from "dotenv";

dotenv.config();

// Create a Redis client for Memurai (Windows Redis)
const redisUrl = process.env.REDIS_URL || "redis://127.0.0.1:6379";

export const redisClient: RedisClientType = createClient({
  url: redisUrl,
  socket: {
    reconnectStrategy: (retries: number) => {
      if (retries > 10) {
        const error = new Error("Unable to connect to Redis after 10 attempts");
        console.error("❌ Redis connection error:", error);
        return error;
      }
      return Math.min(retries * 50, 2000);
    },
  },
  // Only include password if it's set
  ...(process.env.REDIS_PASSWORD && { password: process.env.REDIS_PASSWORD }),
  database: parseInt(process.env.REDIS_DB || "0", 10),
  name: "chat-app-redis",
  disableOfflineQueue: false,
});

// Event listeners
redisClient.on("error", (err) => {
  console.error("❌ Redis connection error:", err.message);
});

redisClient.on("connect", () => {
  console.log("✅ Connected to Redis");
});

redisClient.on("ready", () => {
  console.log("✅ Redis client is ready");
});

redisClient.on("reconnecting", () => {
  console.log("🔄 Attempting to reconnect to Redis...");
});

redisClient.on("end", () => {
  console.log("🔌 Redis connection closed");
});

// Ensure Redis client is connected before sending commands
async function ensureRedisConnected(): Promise<void> {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
}

// Test connection to Redis
export async function testRedis(): Promise<boolean> {
  try {
    await ensureRedisConnected();
    const result = await redisClient.ping();
    console.log("✅ Redis connection test successful:", result);
    return result === "PONG";
  } catch (error) {
    console.error("❌ Redis test failed:", error);
    throw error;
  }
}

// Health check function
export async function checkRedisHealth(): Promise<{
  status: "Healthy" | "UnHealthy";
  timeStamp: Date;
}> {
  try {
    await ensureRedisConnected();
    await redisClient.ping();
    return {
      status: "Healthy",
      timeStamp: new Date(),
    };
  } catch (error) {
    console.error("❌ Redis health check failed:", error);
    return {
      status: "UnHealthy",
      timeStamp: new Date(),
    };
  }
}

// Close the Redis client
export async function closeRedis(): Promise<void> {
  try {
    if (redisClient.isOpen) {
      console.log("🔌 Closing Redis connection...");
      await redisClient.quit();
      console.log("✅ Redis connection closed");
    } else {
      console.log("ℹ️ Redis client not open; nothing to close");
    }
  } catch (err) {
    console.error("❌ Error while closing Redis:", err);
  }
}

// Allow other modules to trigger a background connect attempt
export async function connectRedis(): Promise<void> {
  try {
    await ensureRedisConnected();
  } catch (err) {
    // Do not throw — callers may want to try in background
    console.error("❌ Background Redis connect failed:", err);
  }
}