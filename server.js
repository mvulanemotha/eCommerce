process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const http = require("http");
require("dotenv").config();
const app = require("./app");
//require("dotenv").config();

const PORT = process.env.PORT;

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

server.on("error", (error) => {
  console.log(`Server error: ${error.message}`);
});

process.on("SIGIT", () => {
  console.log("Shutting down server...");
  server.close(() => {
    console.log("Server Closed");
    process.exit(0);
  });
});
