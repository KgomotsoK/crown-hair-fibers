require('dotenv').config({ path: './.env' });
const cors = require('cors');
const express = require('express');
const next = require('next');
const backendApp = require('./Backend/dist/server');

const dev = process.env.NODE_ENV !== 'production';
const port = process.env.PORT || 3000;
const app = next({ dev, dir: './fronted' });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.use(cors({
    origin: 'http://localhost:8000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  }));
  // Mount backend API routes
  server.use('/api', backendApp);

  // Handle Next.js routes
  server.all('*', (req, res) => handle(req, res));

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
}).catch((err) => {
  console.error('Error starting server:', err);
  process.exit(1);
});