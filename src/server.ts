
import http, { IncomingMessage, ServerResponse } from "http";
import { itemsRoute } from "./routes/Items";

const PORT = 3000;

const requestListener = (req: IncomingMessage, res: ServerResponse) => {
  if (req.url?.startsWith("/items")) {
    itemsRoute(req, res);
  } else {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Welcome to the Shopping List API!" }));
  }
};

const server = http.createServer(requestListener);
server.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});
