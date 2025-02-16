import express from "express";
import cors from "cors";
import dotenv from "dotenv";

const PORT = process.env.PORT || 3000;

const app = express();

// Middleware
dotenv.config();
app.use(express.json());
app.use(cors());

// Check route
app.get("/", (req, res) => {
  res.send("Server is alive !");
});

// Routes
import userRoutes from "../server/userController.js";

app.use("/api/users", userRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
