import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Alert,
} from "@mui/material";
import Sentiment from "sentiment";

function MessageInput({ setRewrites, setHistory }) {
  const [message, setMessage] = useState("");
  const [tone, setTone] = useState("friendly");
  const [customTone, setCustomTone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Syllable counter
  const countSyllables = (word) => {
    word = word.toLowerCase();
    if (word.length <= 3) return 1;
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "");
    word = word.replace(/^y/, "");
    const syllables = word.match(/[aeiouy]{1,2}/g);
    return syllables ? syllables.length : 1;
  };

  // Flesch Reading Ease
  const calculateFlesch = (text) => {
    const sentences = text.split(/[.!?]+/).filter(Boolean).length || 1;
    const wordsArr = text.trim().split(/\s+/);
    const words = wordsArr.length;
    const syllables = wordsArr.reduce((sum, w) => sum + countSyllables(w), 0);
    return 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words);
  };

  const calculateMetrics = (text) => {
    const words = text.trim().split(/\s+/).length;
    const fleschScore = calculateFlesch(text);
    const sentimentScore = new Sentiment().analyze(text).score;
    return { fleschScore, sentiment: sentimentScore, wordCount: words };
  };

  const handleRewrite = async () => {
    if (!message.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const combinedTone =
        tone + (customTone.trim() ? `, ${customTone.trim()}` : "");
      const response = await fetch("http://localhost:7000/api/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, tone: combinedTone }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Server error");
        return;
      }

      // Update rewrites in parent
      if (setRewrites) setRewrites(data.rewrites);

      // Update history in parent
      if (setHistory) {
        setHistory((prev) => [...prev, { message, rewrites: data.rewrites }]);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  const metrics = message ? calculateMetrics(message) : null;

  return (
    <Box sx={{ display: "flex", gap: 2, p: 2 }}>
      {/* Metrics panel */}
      {metrics && (
        <Box sx={{ width: 220, p: 2, bgcolor: "#f1f1f1", borderRadius: 1 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Metrics
          </Typography>
          <Typography>Flesch: {metrics.fleschScore.toFixed(2)}</Typography>
          <Typography>Words: {metrics.wordCount}</Typography>
          <Typography>Sentiment: {metrics.sentiment}</Typography>
        </Box>
      )}

      {/* Main input */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
        {error && <Alert severity="error">{error}</Alert>}

        <TextField
          label="Paste your message here..."
          multiline
          rows={4}
          fullWidth
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <FormControl fullWidth>
          <InputLabel>Tone</InputLabel>
          <Select
            value={tone}
            label="Tone"
            onChange={(e) => setTone(e.target.value)}
          >
            <MenuItem value="friendly">Friendly</MenuItem>
            <MenuItem value="professional">Professional</MenuItem>
            <MenuItem value="concise">Concise</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Custom Tone Keywords (optional)"
          fullWidth
          value={customTone}
          onChange={(e) => setCustomTone(e.target.value)}
        />

        <Button
          variant="contained"
          color="primary"
          onClick={handleRewrite}
          disabled={loading}
        >
          {loading ? "Rewriting..." : "Rewrite"}
        </Button>
      </Box>
    </Box>
  );
}

export default MessageInput;
