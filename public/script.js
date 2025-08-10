let player;
const socket = io();

function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: '390',
    width: '640',
    videoId: 'maYVAFdbBv4', // Seu vídeo
    events: {
      onReady: () => console.log("Pronto"),
    }
  });
}

function playVideo() {
  if (isOwner) {
    player.playVideo();
    socket.emit("control", { action: "play" });
  }
}

function pauseVideo() {
  if (isOwner) {
    player.pauseVideo();
    socket.emit("control", { action: "pause" });
  }
}

function seek(seconds) {
  if (isOwner) {
    player.seekTo(seconds, true);
    socket.emit("control", { action: "seek", time: seconds });
  }
}

socket.on("action", (data) => {
  if (!isOwner) {
    if (data.action === "play") player.playVideo();
    if (data.action === "pause") player.pauseVideo();
    if (data.action === "seek") player.seekTo(data.time, true);
  }
});
