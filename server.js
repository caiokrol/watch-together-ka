// server.js

const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

// Serve os arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Lógica do Socket.IO
io.on('connection', (socket) => {
  console.log('Um usuário se conectou:', socket.id);

  // Quando o controlador envia um evento 'play'
  socket.on('play', () => {
    // Retransmite o evento 'play' para todos os outros clientes (os viewers)
    console.log('Evento PLAY recebido. Retransmitindo...');
    socket.broadcast.emit('play');
  });

  // Quando o controlador envia um evento 'pause'
  socket.on('pause', () => {
    // Retransmite o evento 'pause' para todos os outros clientes
    console.log('Evento PAUSE recebido. Retransmitindo...');
    socket.broadcast.emit('pause');
  });

  // Quando o controlador envia um evento 'sync' com o tempo atual
  socket.on('sync', (time) => {
    // Retransmite o evento 'sync' com o tempo para todos os outros clientes
    console.log(`Evento SYNC recebido. Sincronizando para ${time}s`);
    socket.broadcast.emit('sync', time);
  });

  socket.on('disconnect', () => {
    console.log('Usuário desconectado:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Abra o controlador em http://localhost:${PORT}/index.html`);
  console.log(`Abra os espectadores em http://localhost:${PORT}/viewer.html`);
});