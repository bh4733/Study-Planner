import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { createUser, findUser } from "../models/userModel.js";

const router = express.Router();
const SECRET = "supersecretkey";

// ✅ REGISTER
router.post("/register", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = await createUser({
      username: req.body.username,
      password: hashedPassword,
    });

    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ LOGIN
router.post("/login", async (req, res) => {
  const user = await findUser({ username: req.body.username });

  if (!user) {
    return res.status(401).json({ error: "Invalid login" });
  }

  const valid = await bcrypt.compare(req.body.password, user.password);

  if (!valid) {
    return res.status(401).json({ error: "Invalid login" });
  }

  const token = jwt.sign({ userId: user._id }, SECRET, { expiresIn: "1h" });

  res.json({ token });
});

export default router;
