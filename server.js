const http = require("http");
const app = require("./app");

const PORT = process.env.PORT;
console.log(PORT);
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
