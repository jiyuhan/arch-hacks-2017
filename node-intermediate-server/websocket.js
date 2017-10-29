const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8000});

// Broadcast to all.
wss.broadcast = function broadcast(data) {
    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
};

while(1) {
    setTimeout(function() {
        wss.broadcast("hello");
    }, 200);
}
