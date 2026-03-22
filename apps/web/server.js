const http = require('http');

const port = Number(process.env.PORT || 3000);

const server = http.createServer((_req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ service: 'agentflow-web', status: 'pending-nextjs-scaffold' }));
});

server.listen(port, () => {
  console.log(`AgentFlow web placeholder listening on :${port}`);
});
