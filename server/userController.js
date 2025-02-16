import express from "express";
import jwt from "jsonwebtoken";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { comparePassword, hashPassword } from "./utils/auth.js";

const json_base = "http://localhost:5001/";
const JTW_EXPIRATION = { expiresIn: "1h" };

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const response = await fetch(`${json_base}users`);
    const users = await response.json();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

router.post("/create", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password)
      return res
        .status(400)
        .send({ status: "error", message: "Missing required parameters" });

    const generateRandomId = () => uuidv4();

    const newUser = {
      id: generateRandomId(),
      username,
      email,
      password: await hashPassword(password),
    };

    await axios.post(`${json_base}users`, newUser);

    return res.status(201).send({
      status: "success",
      message: "user created successfully",
    });
  } catch (error) {
    console.log(error); // dev mode
    if (error.code === 11000) {
      return res.status(409).json({
        status: "error",
        message: "email or username already exists",
      });
    }
    res.status(500).json({
      status: "error",
      message: "An unexpected error occurred",
      error: error.message,
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res
        .status(400)
        .send({ status: "error", message: "Missing required parameters" });

    const response = await fetch(
      `${json_base}users?email=${encodeURIComponent(email)}`
    );
    const users = await response.json();

    if (users.length === 0) {
      return res.status(404).send({
        status: "error",
        message: "User not found",
      });
    }

    const user = users[0];

    const isCorrectPassword = await comparePassword(password, user.password);

    if (isCorrectPassword) {
      const jwtSecretKey = process.env.JWT_SECRET_KEY;
      console.log(JTW_EXPIRATION);

      const token = jwt.sign(
        {
          email: user.email,
          username: user.username,
        },
        jwtSecretKey,
        JTW_EXPIRATION
      );

      // Set the JWT as a cookie in the response.
      res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: Number(process.env.COOKIE_EXPIRATION),
      });

      res.json({
        status: "succuss",
        message: "Logged in successfully",
        token: token,
        user,
      });
    } else {
      return res.status(401).json({
        status: "error",
        message: "Invalid credentials",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "An unexpected error occurred",
      error: error.message,
    });
  }
});

router.post("/logout", (req, res) => {
  try {
    res.cookie("token", "", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 0,
    });

    res.json({
      status: "success",
      message: "Logged out successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "An unexpected error occurred during logout",
      error: error.message,
    });
  }
});

export default router;
