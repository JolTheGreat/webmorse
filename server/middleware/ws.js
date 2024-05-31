const WebSocket = require("ws")
const wss = new WebSocket.WebSocketServer({port: 3000})
wss.on("connection", (ws, rq) => {
    ws.on("message", (message) => {
        console.log(`Received message => ${message}`)
        const data = JSON.parse(message)
        //data will consist of duration and receivers
        // const { duration, sendTo } = data
        //get sender Id from url query called sender
        // const sender = rq.url.split("=")[1]
        //send message to receivers
        // receivers.forEach((receiver) => {
        //     wss.clients.forEach((client) => {
        //         if (client.readyState === socket.OPEN && client.url === receiver) {
        //             client.send(JSON.stringify({ sender, duration }))
        //         }
        //     })
        // })

        //send to all
        wss.clients.forEach((client) => {
            if (client.readyState === socket.OPEN) {
                client.send("JSON.stringify({ sender, duration })")
            }
        })
    })
})