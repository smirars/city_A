import express from "express";
import cors from "cors";
import db from "./db/connection.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/citizens", async (req, res) => {
  try {
    const citizens = await db("citizens").select("id", "first_name", "last_name");
    res.json(citizens);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch citizens" });
  }
});

app.listen(3001, () => console.log("Backend running on port 3001"));
