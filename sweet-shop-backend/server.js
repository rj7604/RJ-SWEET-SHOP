const express = require("express");
const cors = require("cors");
const { connectDB } = require("./config");
const routes = require("./routes");

connectDB();

const app = express();

// ✅ ENABLE CORS
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());
app.use(routes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
