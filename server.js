const express = require("express");
const app = express();
const port = 5000;
const dotenv = require("dotenv");
const connectDb = require("./config/db/connectDb");
const cors = require("cors");
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});
const userRoute = require("./route/userRoute");
const postRoutes = require("./route/postRoute");
const commentRoute = require("./route/commentRoute");
const { errHandler, notFound } = require("./middleware/error/errorHandler");
const chatRoute = require("./route/chatRoute");
const messageRoute = require("./route/messageRoute");
const productRoute = require("./route/productRoute");

dotenv.config();

server.listen(port, () =>
  console.log(`Example app listening on port ${port}!`)
);
connectDb();

app.use(cors());
app.use(express.json());

io.on("connection", (socket) => {
  socket.on("join-room", (data) => {
    console.log("room join : ", data);
    socket.join(data);
  });

  socket.on("send-message", (data) => {
    console.log(data.content);
    socket.to(data?.chatId).emit("receive-message", data);
  });
});

app.use("/api/users", userRoute);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoute);
app.use("/api/chat", chatRoute);
app.use("/api/message", messageRoute);
app.use("/api/product", productRoute);

app.use(notFound);

app.use(errHandler);
