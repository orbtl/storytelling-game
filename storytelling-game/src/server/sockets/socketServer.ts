import WebSocket, { WebSocketServer } from "ws";

const rooms = {};

export default function makeSocketServer() {
  const wss = new WebSocketServer({ port: 8080 });
  console.log("WebSocket server started on ws://localhost:8080");

  wss.on('connection', (ws, req) => {
    console.log('New client connected, info:', ws, req);
    const room = 'defaultRoom';
    if (!(room in rooms)) {
      rooms[room] = [];
    }
    rooms[room].push(ws);
    console.log(`Client added to room: ${room}`);

    ws.on('message', (message) => {
      const parsedMessage = JSON.parse(message.toString());
      console.log(`Received message: ${parsedMessage}`);
      rooms[room].forEach(client => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(parsedMessage));
        }
      });
    });

    ws.on('close', () => {
      console.log('Client disconnected');
      rooms[room] = rooms[room].filter(client => client !== ws);
      console.log(`Client removed from room: ${room}`);
    });
  });
}
