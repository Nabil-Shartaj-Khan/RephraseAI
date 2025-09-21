import express from "express";
import axios from "axios";

const router = express.Router();

router.post("/", async (req, res) => {
  const { message, tone } = req.body;

  if (!message || !tone) {
    return res.status(400).json({ error: "Message and tone are required." });
  }

  try {
    // Prepare the prompt
    const prompt = `Rewrite the following message in a ${tone} tone. 
Provide exactly 2 alternative versions. 
Output ONLY the sentences, one per line, without any extra text, numbering, or quotes:

"${message}"`;

    const response = await axios.post(
      "https://apifreellm.com/api/chat",
      { message: prompt },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    if (response.data.status !== "success") {
      return res
        .status(500)
        .json({ error: response.data.error || "LLM failed" });
    }

    // The reply from the LLM
    const outputText = response.data.response;

    // Split by lines or numbered list
    const rewrites = outputText
      .split("\n")
      .filter((line) => line.trim()) // remove empty lines
      .map((line) => line.trim()); // clean up extra spaces

    res.json({ rewrites });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Something went wrong." });
  }
});

export default router;
