import dotenv from "dotenv";
dotenv.config({path: "./Config.env"}); // Load env before imports

import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { pool } from "./Config/pg_connection";
import { redisClient } from "./Config/redis_connection";

const app = express();
const server = createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);
  socket.on("disconnect", () => {
    console.log("User Disconnected");
  });
});

// Use pool explicitly to avoid "declared but never read"
(async () => {
  try {
    const res = await pool.query("SELECT NOW()");
    console.log("🕒 Postgres time:", res.rows[0]);
  } catch (err) {
    console.error("❌ Error running test query:", err);
  }
})();

// Use redisClient explicitly to avoid warning
(async () => {
  try {
    await redisClient.set("testKey", "Production Redis Connection Successful");
    const value = await redisClient.get("testKey");
    console.log("🔑 Redis test value:", value);
  } catch (err) {
    console.error("❌ Error running Redis test:", err);
  }
})();

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});