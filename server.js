import express from "express";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017/todos";

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Mongoose Schema & Model
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

// MongoDB connection
mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log(`Connected to MongoDB at ${MONGO_URL}`);
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
  });

// Routes
// GET /todos - Retrieve all todos
app.get("/todos", async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.json(todos);
  } catch (err) {
    console.error("Error fetching todos:", err.message);
    res.status(500).json({ error: "MongoDB connection error: " + err.message });
  }
});

// POST /todos - Create a new todo
app.post("/todos", async (req, res) => {
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
    res.status(500).json({ error: "MongoDB connection error: " + err.message });
  }
});

// DELETE /todos/:id - Delete a todo by ID
app.delete("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTodo = await Todo.findByIdAndDelete(id);
    if (!deletedTodo) {
      return res.status(404).json({ error: "Todo not found" });
    }
    res.json({ message: "Todo deleted successfully", id });
  } catch (err) {
    console.error("Error deleting todo:", err.message);
    res.status(500).json({ error: "MongoDB connection error: " + err.message });
  }
});

// Application startup
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
