 // index.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import bcrypt from "bcrypt";

dotenv.config();

const app = express();

// ✅ Parse JSON request body
app.use(express.json());
app.use(cookieParser());

// ✅ CORS setup
const allowedOrigins = [
  "http://localhost:5173",                     // local dev
  "https://authentivation-register.vercel.app" // deployed frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// =============================
// Mongoose Schema + Model
// =============================
const formDataSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const FormDataModel = mongoose.model("User", formDataSchema);

// ✅ MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// =============================
// REGISTER route
// =============================
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

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await FormDataModel.create({
      email,
      password: hashedPassword,
    });

    res.status(201).json({ message: "User registered", userId: newUser._id });
  } catch (err) {
    console.error("Register error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// =============================
// LOGIN route
// =============================
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await FormDataModel.findOne({ email });
    if (!user) return res.status(404).json({ error: "No records found!" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Wrong password" });
    }

    res.json({ message: "Login success" });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// =============================
// Root check
// =============================
app.get("/", (req, res) => {
  res.send("Hello from backend 🚀");
});

// ✅ PORT (Render requirement)
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
