const socket = io();
let player;
let isOwner = window.isOwner || false;

window.onload = () => {
  player = videojs("videoPlayer");

  socket.on("connect", () => {
    console.log("Socket conectado, id:", socket.id);
  });
  

  if (isOwner) {
    socket.emit("register-owner");
  } else {
    // Espectador: desabilitar controles para não interferir
    player.controlBar.disable();
    player.controls(false);
  }

  if (isOwner) {
    player.on("play", () => {
      socket.emit("control-event", { type: "play" });
    });

    player.on("pause", () => {
      socket.emit("control-event", { type: "pause" });
    });

    player.on("seeked", () => {
      socket.emit("control-event", { type: "seek", time: player.currentTime() });
    });
  }

  socket.on("control-event", (data) => {
    if (!isOwner) {
      switch (data.type) {
        case "play":
          player.play();
          break;
        case "pause":
          player.pause();
          break;
        case "seek":
          player.currentTime(data.time);
          break;
      }
    }
  });
};
