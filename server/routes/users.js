import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { createUser, findUser } from "../models/userModel.js";
import { JWT_SECRET, TOKEN_LIFETIME } from "../config.js";
import { asyncHandler } from "../utils/asynchandler.js";

const router = express.Router();

const readCredentials = (body = {}) => ({
  username: typeof body.username === "string" ? body.username.trim() : "",
  password: typeof body.password === "string" ? body.password : "",
});

// POST /api/users/register
router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const { username, password } = readCredentials(req.body);
    const errors = {};

    if (!/^[A-Za-z0-9_.-]{3,30}$/.test(username)) {
      errors.username =
        "Username must be 3–30 letters, numbers, dots, dashes or underscores";
    }
    // bcrypt ignores anything after 72 bytes, so longer passwords would give false security
    if (password.length < 8 || password.length > 72) {
      errors.password = "Password must be 8–72 characters";
    }
    if (Object.keys(errors).length) {
      return res.status(400).json({ error: "Validation failed", details: errors });
    }

    if (await findUser({ username })) {
      return res.status(409).json({ error: "That username is already taken" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await createUser({ username, password: hashed });

    // Never send the password hash back
    res.status(201).json({ _id: user._id, username: user.username });
  })
);

// POST /api/users/login
router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { username, password } = readCredentials(req.body);
    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and password are required" });
    }

    const user = await findUser({ username });
    const valid = user && (await bcrypt.compare(password, user.password));

    // Same message for "no such user" and "wrong password", so usernames can't be discovered
    if (!valid) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: TOKEN_LIFETIME }
    );

    res.json({ token, user: { _id: user._id, username: user.username } });
  })
);

export default router;
