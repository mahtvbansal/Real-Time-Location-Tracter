import express from "express";
import { Server } from "socket.io";
import http from "http";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

const app = express();
const server = http.createServer(app);
const io = new Server(server, { /* options */ });


app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", function(req, res) {
    console.log("heyy")
    res.render('index');
})

io.on("connection", (socket) => {
    socket.on("send-location", (data)=> {
        console.log(data)
        console.log(socket.id)
        socket.emit("receive-location", {id: socket.id, ...data});
    })

    socket.on("disconnect", () => {
        console.log(socket.id)
        socket.emit("user-disconnected", socket.id);
    })
});


server.listen(3000);