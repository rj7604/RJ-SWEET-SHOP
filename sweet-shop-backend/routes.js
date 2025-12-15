const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { User, Sweet } = require("./models");
const { auth, admin } = require("./middleware");

const router = express.Router();

/* =====================
   AUTH ROUTES
===================== */

// REGISTER
router.post("/api/auth/register", async (req, res) => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    // Check existing user
    const existing = await User.findOne({ username });
    if (existing) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      password: hashed,
      role: role || "user"
    });

    res.json({ message: "User registered successfully" });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// LOGIN
router.post("/api/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* =====================
   SWEETS (PROTECTED)
===================== */

// ADD SWEET (ADMIN)
router.post("/api/sweets", auth, admin, async (req, res) => {
  const sweet = await Sweet.create(req.body);
  res.json(sweet);
});

// GET ALL SWEETS
router.get("/api/sweets", auth, async (req, res) => {
  const sweets = await Sweet.find();
  res.json(sweets);
});

// UPDATE SWEET
router.put("/api/sweets/:id", auth, admin, async (req, res) => {
  const sweet = await Sweet.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(sweet);
});

// DELETE SWEET
router.delete("/api/sweets/:id", auth, admin, async (req, res) => {
  await Sweet.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

// PURCHASE
router.post("/api/sweets/:id/purchase", auth, async (req, res) => {
  const sweet = await Sweet.findById(req.params.id);

  if (!sweet || sweet.quantity <= 0) {
    return res.status(400).json({ message: "Out of stock" });
  }

  sweet.quantity -= 1;
  await sweet.save();
  res.json(sweet);
});

// RESTOCK (ADMIN)
router.post("/api/sweets/:id/restock", auth, admin, async (req, res) => {
  const { amount } = req.body;
  const sweet = await Sweet.findById(req.params.id);

  sweet.quantity += amount;
  await sweet.save();
  res.json(sweet);
});

module.exports = router;
