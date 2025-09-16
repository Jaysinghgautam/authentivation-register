 const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const FormDataModel = require("./models/FormData");
require("dotenv").config();

const app = express();

// ✅ Parse JSON request body
app.use(express.json());

// ✅ CORS
app.use(
  cors({
    origin: [
      "http://localhost:5173", // frontend dev
      "https://authentivation-register.vercel.app", // deployed frontend
    ],
    credentials: true,
  })
);

// ✅ MongoDB connection
mongoose
  .connect(`${process.env.MONGO_URI}/rani`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// REGISTER route
app.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    const existingUser = await FormDataModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Already registered" });
    }

    const newUser = await FormDataModel.create(req.body);
    res.status(201).json(newUser);
  } catch (err) {
    console.error("Register error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// LOGIN route
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await FormDataModel.findOne({ email });
    if (!user) return res.status(404).json({ error: "No records found!" });

    if (user.password !== password) {
      return res.status(400).json({ error: "Wrong password" });
    }

    res.json({ message: "Success" });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Root check
app.get("/", (req, res) => {
  res.send("hello from backend");
});

// ✅ PORT (important fix for Render)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
