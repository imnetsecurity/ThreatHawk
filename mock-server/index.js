const express = require('express');
const https = require('https';
const fs = require('fs');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const port = 3000;

const commandQueue = [
  { id: "cmd-002", action: "kill_process", target: "sleep" },
  { id: "cmd-003", action: "quarantine_file", target: "malicious_file.txt" }
];

// Use the modern, built-in Express JSON parser
app.use(express.json());

// Proxy /ingest to the Next.js app
app.use('/ingest', createProxyMiddleware({
  target: 'http://localhost:3000', 
  changeOrigin: true,
  pathRewrite: { '^/ingest': '/api/events' },
  logger: console,
}));

app.get('/commands/:agentId', (req, res) => {
  res.status(200).json(commandQueue);
});

// Using a placeholder for the key/cert for now to avoid fs errors if files don't exist
// In a real prod env, these paths would be guaranteed to exist.
const httpsOptions = {
  key: fs.existsSync(path.join(__dirname, 'key.pem')) ? fs.readFileSync(path.join(__dirname, 'key.pem')) : '',
  cert: fs.existsSync(path.join(__dirname, 'cert.pem')) ? fs.readFileSync(path.join(__dirname, 'cert.pem')) : '',
};

// We will only start an HTTPS server if the key and cert are present
if (httpsOptions.key && httpsOptions.cert) {
    https.createServer(httpsOptions, app).listen(port, () => {
      console.log(`Mock HTTPS server (proxy) listening at https://localhost:${port}`);
    });
} else {
    app.listen(port, () => {
        console.log(`Mock HTTP server (proxy) listening at http://localhost:${port}`);
    });
}
