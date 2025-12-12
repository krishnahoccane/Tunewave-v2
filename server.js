// server.js
const express = require('express');
const path = require('path');

const app = express();
const root = path.join(__dirname, 'build'); // CRA build folder. Use 'dist' for Vite

app.use(express.static(root));

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(root, 'index.html'));
});

const port = process.env.PORT || 3000;   // cPanel will set process.env.PORT
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
