import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleGetMenu, handleGetMenuByCategory, handleGetMenuSeparated, handleAddMenuItem, handleUpdateMenuItem, handleDeleteMenuItem } from "./routes/menu";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "Hello from Express server v2!" });
  });

  app.get("/api/demo", handleDemo);

  // Menu API routes
  app.get("/api/menu", handleGetMenu);
  app.get("/api/menu/:category", handleGetMenuByCategory);
  app.get("/api/menu-separated", handleGetMenuSeparated);

  // Items API routes
  app.post("/api/items", handleAddMenuItem);
  app.put("/api/items/:id", handleUpdateMenuItem);
  app.delete("/api/items/:id", handleDeleteMenuItem);

  // Test endpoint to verify API is working
  app.get("/api/test", (_req, res) => {
    res.json({ 
      message: "API is working!", 
      timestamp: new Date().toISOString(),
      endpoints: [
        "/api/menu",
        "/api/menu/:category",
        "/api/menu-separated",
        "POST /api/items",
        "PUT /api/items/:id",
        "DELETE /api/items/:id"
      ]
    });
  });

  return app;
}
