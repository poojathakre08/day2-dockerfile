const http = require("http");

const PORT = process.env.PORT || 3000;
const GREETING = process.env.GREETING || "Hello from Docker v2";

const server = http.createServer((req, res) => {
    if (req.url === "/health") {
        res.writeHead(200, { "Content-Type": "text/plain" });
        return res.end("ok");
    }

    if (req.url === "/") {
        res.writeHead(200, { "Content-Type": "text/plain" });
        return res.end(
            `${GREETING} | env=${process.env.APP_ENV || "dev"}\n`
        );
    }

    res.writeHead(404);
    res.end("Not Found");
});

server.listen(PORT, "0.0.0.0", () => {
    console.log(`API listening on port ${PORT}`);
});
