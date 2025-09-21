import { Card, CardContent, Button, Stack } from "@mui/material";

function RewritesList({ rewrites }) {
  if (!rewrites.length) return null;

  return (
    <Stack spacing={2} sx={{ mb: 4 }}>
      {rewrites.map((text, idx) => (
        <Card key={idx} variant="outlined">
          <CardContent sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>{text}</span>
            <Button variant="contained" color="secondary" onClick={() => navigator.clipboard.writeText(text)}>
              Copy
            </Button>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
}

export default RewritesList;
