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
  Paper,
} from "@mui/material";

function MessageRewriter() {
  const [message, setMessage] = useState("");
  const [tone, setTone] = useState("friendly");
  const [loading, setLoading] = useState(false);
  const [rewrites, setRewrites] = useState([]);
  const [history, setHistory] = useState([]);

  const handleRewrite = async () => {
    if (!message.trim()) return;
    setLoading(true);

    try {
      const response = await fetch("http://localhost:7000/api/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, tone }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Something went wrong on the server");
        return;
      }

      setRewrites(data.rewrites);
      setHistory((prev) => [
        { original: message, rewrites: data.rewrites },
        ...prev,
      ]);
      setMessage("");
    } catch (err) {
      console.error(err);
      alert(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", p: 2, gap: 10 }}>
      {/* History Column */}
      <Box sx={{ width: "30%", overflowY: "auto" }}>
        <Typography variant="h5" sx={{ mb: 1, fontWeight: "bold" }}>
          Chat History
        </Typography>
        {history.map((item, idx) => (
          <Paper key={idx} sx={{ p: 1, mb: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>Original:</Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              {item.original}
            </Typography>
            <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>Rewrites:</Typography>
            {item.rewrites.map((rw, i) => (
              <Box
                key={i}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 0.5,
                }}
              >
                <Typography variant="body2">{rw}</Typography>
                <Button
                  size="small"
                  onClick={() => navigator.clipboard.writeText(rw)}
                >
                  Copy
                </Button>
              </Box>
            ))}
          </Paper>
        ))}
      </Box>

      {/* Current Input + Rewrites Column */}
      <Box sx={{ width: "70%" }}>
        <Paper sx={{ p: 2, mb: 2 }}>
          <TextField
            label="Paste your message here..."
            multiline
            rows={4}
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            margin="normal"
          />

          <FormControl fullWidth margin="normal">
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

          <Button
            variant="contained"
            color="primary"
            onClick={handleRewrite}
            fullWidth
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? "Rewriting..." : "Rewrite"}
          </Button>
        </Paper>

        {/* Current Rewrites */}
        {rewrites.length > 0 && (
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: "bold" }}>
              You can say it like this:
            </Typography>
            {rewrites.map((rw, idx) => (
              <Box
                key={idx}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1,
                  p: 1,
                  border: "1px solid #7d7979ff",
                  borderRadius: 1,
                }}
              >
                <Typography>{rw}</Typography>
                <Button
                  size="small"
                  onClick={() => navigator.clipboard.writeText(rw)}
                >
                  Copy
                </Button>
              </Box>
            ))}
          </Paper>
        )}
      </Box>
    </Box>
  );
}

export default MessageRewriter;
