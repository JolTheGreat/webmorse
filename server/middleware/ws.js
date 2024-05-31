import { WebSocketServer } from 'ws';


export default eventHandler((event) => {
    console.log("Starting backend")
    const wss = new WebSocketServer({ noServer: true});
    wss.on('connection', function connection(ws, req) {

        ws.on('message', function message(data) {
            console.log('received: %s', data);
            const { duration, sendTo } = JSON.parse(data);
            const sender = req.url.split('/')[req.url.split('/').length - 1];
            console.log("Sender: ", sender);
            // sendTo.split(',').forEach((receiver) => {
            //     wss.clients.forEach((client) => {
            //         console.log("Receiver: ", receiver);
            //     });
            // });

            wss.clients.forEach((client) => {
                const d = {
                    sender: sender,
                    duration: duration
                }
                console.log("Sending: ", d)
                client.send(JSON.stringify(d));
            });

        });
    });
})
