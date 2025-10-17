import { IncomingMessage, ServerResponse } from "http";
import {
  getItems,
  getItemById,
  addItem,
  updateItem,
  deleteItem,
} from "../controllers/Items";

// http://localhost:3000/items
export const itemsRoute = (req: IncomingMessage, res: ServerResponse) => {
  if (!req.url?.startsWith("/items")) return;

  const parts = req.url.split("/");
  const id = parts[2] ? parseInt(parts[2]) : undefined;

  // GET all items
  if (req.method === "GET" && !id) {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(getItems()));
    return;
  }

  // GET item by ID
  if (req.method === "GET" && id) {
    if (isNaN(id)) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Invalid item ID" }));
      return;
    }

    const item = getItemById(id);
    if (!item) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Item not found" }));
      return;
    }

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(item));
    return;
  }

  // POST new item
  if (req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => (body += chunk.toString()));
    req.on("end", () => {
      try {
        const { name, quantity, purchased } = JSON.parse(body);
        if (!name || typeof name !== "string") {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Item name is required" }));
          return;
        }
        if (typeof quantity !== "number") {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Item quantity must be a number" }));
          return;
        }
        if (typeof purchased !== "boolean") {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({ error: "Purchased status must be boolean" })
          );
          return;
        }

        const newItem = addItem(name, quantity, purchased);
        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(JSON.stringify(newItem));
      } catch {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Invalid JSON payload" }));
      }
    });
    return;
  }

  // PUT (Update existing item)
  if (req.method === "PUT" && id) {
    let body = "";
    req.on("data", (chunk) => (body += chunk.toString()));
    req.on("end", () => {
      try {
        const updates = JSON.parse(body);
        const item = updateItem(id, updates);

        if (!item) {
          res.writeHead(404, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Item not found" }));
          return;
        }

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(item));
      } catch {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Invalid JSON payload" }));
      }
    });
    return;
  }

  //  DELETE item by ID
  if (req.method === "DELETE" && id) {
    const success = deleteItem(id);

    if (!success) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Item not found" }));
      return;
    }

    res.writeHead(204);
    res.end();
    return;
  }

  // Method not allowed
  res.writeHead(405, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Method not allowed on /items" }));
};
