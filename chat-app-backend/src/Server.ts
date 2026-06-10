import dotenv from "dotenv";
dotenv.config({path: "./Config.env"}); // Load env before imports

import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import { pool } from "./Config/pg_connection";
import { redisClient, testRedis, closeRedis, connectRedis } from "./Config/redis_connection";
import path from "path";
import redoc from "redoc-express";
import usersRoutes from "./Routes/Users.Routes";
import messagesRoutes from "./Routes/Messages.Routes";

const app = express();

// Middleware
app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount routes
app.use("/api/users", usersRoutes);
app.use("/api/messages", messagesRoutes);
const server = createServer(app);
const io = new Server(server);

// Serve the OpenAPI spec file
app.get("/docs/openapi.yaml", (req, res) => {
  res.sendFile(path.join(__dirname, "./docs/openapi.yaml"));
});

// ReDoc UI for API documentation (serves only the UI, does not list other routes)
app.get(
  "/docs",
  redoc({
    title: "API Documentation",
    specUrl: "/docs/openapi.yaml",
  })
);

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);
  socket.on("disconnect", () => {
    console.log("User Disconnected");
  });
});

// ============================================
// GRACEFUL SHUTDOWN
// ============================================
const gracefulShutdown = async (signal: string) => {
  console.log(`\n${signal} received, shutting down gracefully...`);
  try {
    await closeRedis();
    console.log("✅ Redis closed");
    
    server.close(() => {
      console.log("✅ HTTP server closed");
      process.exit(0);
    });
  } catch (err) {
    console.error("❌ Error during shutdown:", err);
    process.exit(1);
  }
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// ============================================
// START SERVER
// ============================================
const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // Try Redis connection but do not block server startup if it fails
    try {
      await testRedis();
    } catch (err) {
      console.warn("⚠️ Redis unavailable at startup — continuing without Redis. Will retry in background.");
      // Attempt to connect in the background (non-blocking)
      connectRedis();
    }

    // ✅ Start HTTP server
    server.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════╗
║   🚀 Server is running on port ${PORT}     ║
║   📚 API Docs: http://localhost:${PORT}/docs ║
╚════════════════════════════════════════╝
      `);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
}

startServer();