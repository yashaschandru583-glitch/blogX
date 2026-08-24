import express from 'express';
import cors from 'cors';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { initDatabase } from './server/db.js';
import { authRouter } from './server/routes/auth.js';
import { postsRouter } from './server/routes/posts.js';
import { commentsRouter } from './server/routes/comments.js';
import { uploadRouter } from './server/routes/upload.js';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(cors());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Initialize DB & Seed Data
  await initDatabase();

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ 
      status: 'ok', 
      platform: 'BLOGX Full-Stack Platform',
      serverTime: new Date().toISOString() 
    });
  });

  app.use('/api/auth', authRouter);
  app.use('/api/posts', postsRouter);
  app.use('/api/upload', uploadRouter);
  app.use('/api', commentsRouter);

  // Vite middleware for development vs static dist in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`BLOGX Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start BLOGX server:', err);
});
