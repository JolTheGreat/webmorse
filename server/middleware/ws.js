import { WebSocketServer} from "ws";

let wss = null;
export default defineEventHandler(async (event) => {
   if (!wss) {
       const server = event.node.res.socket?.server;
       const wss = new WebSocketServer({ server: server });
       wss.on('connection', function connection(ws, req) {
           console.log("Connection established")
           ws.on('message', function message(data) {
               const { duration, sendTo } = JSON.parse(data);
               const sender = req.url.split('/')[req.url.split('/').length - 1];
               wss.clients.forEach((client) => {
                   const d = {
                       sender: sender,
                       duration: duration
                   }
                   client.send(JSON.stringify(d));
               });

           });
       });
   }
});