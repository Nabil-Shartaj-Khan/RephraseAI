import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import rewriteRoutes from "./routes/rewrite.js";

dotenv.config();
console.log("Loaded OPENAI_API_KEY:", process.env.OPENAI_API_KEY);

const app = express();
const PORT = process.env.PORT || 5000;

// Allow only your frontend
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["POST", "GET"], // allow POST (for rewrite) and GET (for health check)
}));


app.use(express.json());

app.use("/api/rewrite", rewriteRoutes);

app.get("/", (req, res) => {
  res.send("AI Conversation Rephraser Backend is running.");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
