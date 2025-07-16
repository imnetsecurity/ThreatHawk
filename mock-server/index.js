const express = require('express');
const bodyParser = require('body-parser');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const port = 3000;

const commandQueue = [
  { id: "cmd-002", action: "kill_process", target: "sleep" },
  { id: "cmd-003", action: "quarantine_file", target: "malicious_file.txt" }
];

app.use(bodyParser.json());

// Proxy /ingest to the Next.js app (now over HTTP)
app.use('/ingest', createProxyMiddleware({
  target: 'http://localhost:3000', 
  changeOrigin: true,
  pathRewrite: { '^/ingest': '/api/events' },
  logger: console,
}));

app.get('/commands/:agentId', (req, res) => {
  res.status(200).json(commandQueue);
});

// Start a plain HTTP server
app.listen(port, () => {
  console.log(`Mock HTTP server (proxy) listening at http://localhost:${port}`);
});
