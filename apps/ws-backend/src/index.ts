import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 9000});

wss.on('connection', (ws) => {
    console.log("new client connected");

    ws.on('message', function message (data){
        ws.send("server received your message");
    })

    ws.on('close', () => {
        console.log("Server closed")
    });

    ws.send('Welcome to websocket server')
})

