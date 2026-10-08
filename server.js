import express from "express";
import client from "prom-client";
import mongoose from "mongoose";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017/todos";

// Initialize Prometheus registry and metrics
const register = new client.Registry();
client.collectDefaultMetrics({ register });

const httpRequestCounter = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests received",
  labelNames: ["method", "route", "status"],
  registers: [register],
});

const httpRequestDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "status"],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
  registers: [register],
});

// Middleware to track request metrics
app.use((req, res, next) => {
  const start = process.hrtime();
  res.on("finish", () => {
    const elapsed = process.hrtime(start);
    const durationInSeconds = elapsed[0] + elapsed[1] / 1e9;
    const route = req.route ? req.route.path : req.path;
    const labels = {
      method: req.method,
      route: route || req.path,
      status: res.statusCode.toString(),
    };
    httpRequestCounter.inc(labels);
    httpRequestDuration.observe(labels, durationInSeconds);
  });
  next();
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Determine static assets directory (.output/public if built, fallback to public)
const publicDir = fs.existsSync(path.join(__dirname, ".output", "public"))
  ? path.join(__dirname, ".output", "public")
  : path.join(__dirname, "public");

app.use(express.static(publicDir));
app.use(express.static(path.join(__dirname, "public")));

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Prometheus metrics endpoint
app.get("/metrics", async (req, res) => {
  try {
    res.set("Content-Type", register.contentType);
    res.end(await register.metrics());
  } catch (err) {
    res.status(500).end(err.message);
  }
});

// Mongoose Schema & Model (preserves practice task compatibility)
const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Todo = mongoose.model("Todo", todoSchema);

// Optional MongoDB connection (non-fatal if MongoDB is not running)
if (MONGO_URL) {
  mongoose
    .connect(MONGO_URL, { serverSelectionTimeoutMS: 2000 })
    .then(() => {
      console.log(`Connected to MongoDB at ${MONGO_URL}`);
    })
    .catch((err) => {
      console.warn("MongoDB connection warning (optional):", err.message);
    });
}

// Routes
// GET /todos - Retrieve all todos
app.get("/todos", async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.json([]);
  }
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.json(todos);
  } catch (err) {
    console.error("Error fetching todos:", err.message);
    res.status(500).json({ error: "MongoDB error: " + err.message });
  }
});

// POST /todos - Create a new todo
app.post("/todos", async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ error: "Database not connected" });
  }
  try {
    const title = req.body.title || req.body.task || req.body.text;
    if (!title || !title.trim()) {
      return res.status(400).json({ error: "Todo title is required" });
    }
    const todo = new Todo({ title: title.trim() });
    const savedTodo = await todo.save();
    res.status(201).json(savedTodo);
  } catch (err) {
    console.error("Error creating todo:", err.message);
    res.status(500).json({ error: "MongoDB error: " + err.message });
  }
});

// DELETE /todos/:id - Delete a todo by ID
app.delete("/todos/:id", async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ error: "Database not connected" });
  }
  try {
    const { id } = req.params;
    const deletedTodo = await Todo.findByIdAndDelete(id);
    if (!deletedTodo) {
      return res.status(404).json({ error: "Todo not found" });
    }
    res.json({ message: "Todo deleted successfully", id });
  } catch (err) {
    console.error("Error deleting todo:", err.message);
    res.status(500).json({ error: "MongoDB error: " + err.message });
  }
});

// Application startup
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
