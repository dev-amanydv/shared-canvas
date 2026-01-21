import { WebSocketServer } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
const wss = new WebSocketServer({ port: 9000});

interface AuthJwtPayload extends JwtPayload {
    userId?: string
}

wss.on('connection', (ws, request) => {
    console.log("new client connected");

    const url = request.url;
    if (!url) return;

    const queryParams = new URLSearchParams(url?.split('?')[1]);
    const token = queryParams.get('token') ?? "";

    const decoded = jwt.verify(token, 'secret') as AuthJwtPayload;
    if (!decoded || !decoded.userId) {
        ws.close();
        return;
    }
    
    ws.on('message', function message (data){
        ws.send("server received your message");
    })

    ws.on('close', () => {
        console.log("Server closed")
    });

    ws.send('Welcome to websocket server')
})

