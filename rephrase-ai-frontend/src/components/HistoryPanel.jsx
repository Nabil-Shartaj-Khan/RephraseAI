import { Card, CardContent, Typography, Stack } from "@mui/material";

function HistoryPanel({ history }) {
  if (!history.length) return null;

  return (
    <Stack spacing={2}>
      <Typography variant="h5">History:</Typography>
      {history.map((item, idx) => (
        <Card key={idx} variant="outlined">
          <CardContent>
            <Typography variant="subtitle1" gutterBottom>Original: {item.message}</Typography>
            <Stack spacing={1}>
              {item.rewrites.map((text, i) => (
                <Typography key={i} variant="body2">- {text}</Typography>
              ))}
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
}

export default HistoryPanel;
