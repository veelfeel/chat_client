const sender_id = (Date.now() / 1000) | 0;
console.log(1);
const ws = new WebSocket("wss://chat-cpwa.onrender.com");
ws.addEventListener("open", () => {
  console.log("we are connected");
});

ws.addEventListener("message", (e) => {
  const data = JSON.parse(e.data);
  if (sender_id !== data.sender_id) {
    const messageHtml = `<div>user ${data.sender_id}: ${data.message}</div>`;

    document
      .getElementById("chatBody")
      .insertAdjacentHTML("beforeend", messageHtml);
  }
});

document
  .getElementById("sendButton")
  .addEventListener("click", sendMessageToTheServer);

function sendMessageToTheServer() {
  const message = document.getElementById("textMessage").value;
  const messageHtml = `<div>user ${sender_id}: ${message}</div>`;

  document
    .getElementById("chatBody")
    .insertAdjacentHTML("beforeend", messageHtml);

  const jsonData = { sender_id: sender_id, message: message };

  ws.send(JSON.stringify(jsonData));

  document.getElementById("textMessage").value = "";
}
