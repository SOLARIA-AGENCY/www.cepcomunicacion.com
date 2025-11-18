const http = require('http');

const server = http.createServer((req, res) => {
  console.log(`Request: ${req.method} ${req.url}`);
  
  if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>CEP Formación - Test Server</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif;">
        <div style="height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
          <div>
            <h1>🎯 CEP Formación Test Server</h1>
            <p>Servidor funcionando correctamente en puerto 3000</p>
            <p style="font-size: 0.9rem; opacity: 0.8;">Process ID: ${process.pid}</p>
            <p style="font-size: 0.9rem; opacity: 0.8;">Timestamp: ${new Date().toISOString()}</p>
          </div>
        </div>
      </body>
      </html>
    `);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 - Not Found');
  }
});

server.listen(3000, '0.0.0.0', () => {
  console.log('✅ Server running on http://localhost:3000');
  console.log('✅ Process ID:', process.pid);
  console.log('🌐 Serving from:', __dirname);
});

process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});