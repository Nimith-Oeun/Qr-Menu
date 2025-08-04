import type { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import cors from 'cors';
import { handleDemo } from './routes/demo.js';
import { handleGetMenu, handleGetMenuByCategory, handleGetMenuSeparated } from './routes/menu.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.get("/api/ping", (_req, res) => {
  res.json({ message: "Hello from Express server v2!" });
});

app.get("/api/demo", handleDemo);
app.get("/api/menu", handleGetMenu);
app.get("/api/menu/:category", handleGetMenuByCategory);
app.get("/api/menu-separated", handleGetMenuSeparated);

// Test endpoint
app.get("/api/test", (_req, res) => {
  res.json({ 
    message: "API is working!", 
    timestamp: new Date().toISOString(),
    endpoints: [
      "/api/menu",
      "/api/menu/:category",
      "/api/menu-separated"
    ]
  });
});

export default (req: VercelRequest, res: VercelResponse) => {
  return app(req, res);
};
