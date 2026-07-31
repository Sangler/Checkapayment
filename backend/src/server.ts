import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { pool } from "./db/postgres";
import { initializeTemporaryStore, isRedisEnabled } from "./services/authStore";
import authRoutes from "./routes/auth.routes";

const app = express();

// FRONTEND_URL may hold one or more (comma-separated) allowed origins, e.g.
// a deployed tunnel URL. Local dev origins are always allowed outside of
// production so `npm run dev` keeps working regardless of what's in .env.
const configuredOrigins = (process.env.FRONTEND_URL || "http://localhost:8080")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true); // non-browser requests (curl, health checks)
      if (configuredOrigins.includes(origin)) return callback(null, true);
      if (process.env.NODE_ENV !== "production" && /^http:\/\/localhost:\d+$/.test(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

app.get("/", (_, res) => {
  res.json({ ok: true, message: "Backend running" });
});

app.get("/health", (_, res) => {
  res.json({ ok: true, message: "Backend is healthy", redis: isRedisEnabled() });
});

app.use("/auth", authRoutes);

const PORT = Number(process.env.PORT) || 3000;

async function start() {
  await initializeTemporaryStore();

  try {
    const result = await pool.query("SELECT NOW() as now");
    console.log("Database connection OK:", result.rows[0].now);
  } catch (error) {
    console.error("Database connection check failed:", error);
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

start();