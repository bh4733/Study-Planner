import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config.js";

export const authenticate = (req, res, next) => {
  const header = req.headers.authorization || "";
  // Accept the standard "Bearer <token>" format, and a bare token
  const token = header.startsWith("Bearer ") ? header.slice(7) : header;

  if (!token) {
    return res.status(401).json({ error: "Not logged in" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = { userId: decoded.userId, username: decoded.username };
    next();
  } catch (err) {
    const message =
      err.name === "TokenExpiredError"
        ? "Session expired, please log in again"
        : "Invalid token";
    res.status(401).json({ error: message });
  }
};
