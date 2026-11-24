const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

const votos = [0, 0, 0];

const personasQueVotaron = new Set();

app.use(express.static("public"));

io.on("connection", (socket) => {
  socket.emit("actualizar-votos", votos);

  socket.on("consultar-voto", (identificador, responder) => {
    responder({ yaVoto: personasQueVotaron.has(identificador) });
  });

  socket.on("votar", (datos, responder) => {
    const opcion = Number(datos.opcion);
    const identificador = datos.identificador;

    if (personasQueVotaron.has(identificador)) {
      return responder({ correcto: false });
    }

    personasQueVotaron.add(identificador);
    votos[opcion]++;

    io.emit("actualizar-votos", votos);
    responder({ correcto: true, mensaje: "¡Tu voto fue registrado!" });
  });
});

server.listen(PORT, () => {
  console.log(`Aplicación en http://localhost:${PORT}`);
});
