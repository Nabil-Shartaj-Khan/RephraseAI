import { useState } from "react";
import {
  ThemeProvider,
  CssBaseline,
  Container,
  Typography, Box
} from "@mui/material";
import theme from "./theme";
import MessageInput from "./components/MessageInput";
import RewritesList from "./components/RewritesList";
import HistoryPanel from "./components/HistoryPanel";

function App() {
  const [rewrites, setRewrites] = useState([]);
  const [history, setHistory] = useState([]);
  console.log("Current history:", history);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h3" align="center" gutterBottom>
          RephraseAI: Your AI Message Rewriter
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          gutterBottom
          sx={{ mb: 4, color: "green" }}
        >
          Enter your message and choose a tone to get rephrased suggestions.
        </Typography>

        <Box sx={{ display: "flex", gap: 2 }}>
          <Box sx={{ flex: 2 }}>
            <MessageInput setRewrites={setRewrites} setHistory={setHistory} />
            <RewritesList rewrites={rewrites} />
          </Box>

          <Box sx={{ flex: 1 }}>
            <HistoryPanel history={history} />
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
