import jwt from "jsonwebtoken";
import User from "../models/User.js";


export const authMiddleware = async(req,res,next)=>{
    try {
        const token = req.headers.authorization;
        if(!token) return res.status(401).send("Token not provided");

        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decode.id;
        next()
    } catch (error) {
        res.status(401).send("Invalid token")
    }
}

export const protect = async (req, res, next) => {
  try {
    // Strip surrounding quotes and whitespace from the raw header value
    let raw = req.headers.authorization || "";
    raw = raw.trim().replace(/^["']+|["']+$/g, "");

    if (!raw) {
      return res.status(401).json({ message: "No token provided" });
    }

// Parse token: accept "Bearer <token>", "<token>", or "Bearer<token>"
    let token;
    const parts = raw.split(/\s+/);
    if (parts[0].toLowerCase() === "bearer") {
      token = parts[1]; // "Bearer <token>"
    } else if (parts.length === 1 && raw.toLowerCase().startsWith("bearer")) {
      token = raw.slice("bearer".length); // "Bearer<token>" (no space)
    } else {
      token = parts[0]; // raw "<token>" only
    }

    if (!token) {
      return res.status(401).json({
        message: "Not authorized",
        received: raw,
        hint: 'Use header: Authorization: Bearer <token> (no quotes, no extra spaces)',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    next();
  } catch (error) {
    res.status(401).json({ message: "Token failed", detail: error.message });
  }
};
