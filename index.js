const sender_id = (Date.now() / 1000) | 0;

const ws = new WebSocket("wss://chat-cpwa.onrender.com");
ws.addEventListener("open", () => {
  console.log("we are connected");
});

ws.addEventListener("message", (e) => {
  const data = JSON.parse(e.data);
  if (sender_id !== data.sender_id) {
    const messageHtml = `<div class="message message-recipient">
                          <div class="sent-message">${data.message}</div>
                        </div>`;

    document
      .getElementById("chatBody")
      .insertAdjacentHTML("beforeend", messageHtml);
  }
});

document
  .getElementById("sendButton")
  .addEventListener("click", sendMessageToTheServer);

document.getElementById("textMessage").addEventListener("keydown", (e) => {
  if (
    e.code == "Enter" &&
    document.getElementById("textMessage").value !== ""
  ) {
    sendMessageToTheServer();
  }
});

function sendMessageToTheServer() {
  if (document.getElementById("textMessage").value !== "") {
    const message = document.getElementById("textMessage").value;
    const messageHtml = `<div class="message message-sender">
                          <div class="sent-message">${message}</div>
                        </div>`;

    document
      .getElementById("chatBody")
      .insertAdjacentHTML("beforeend", messageHtml);

    const jsonData = { sender_id: sender_id, message: message };

    ws.send(JSON.stringify(jsonData));

    document.getElementById("textMessage").value = "";
    hideShowSendButton();
  }
}

document
  .getElementById("textMessage")
  .addEventListener("input", hideShowSendButton);

function hideShowSendButton() {
  document.getElementById("textMessage").value !== ""
    ? document
        .getElementById("sendButton")
        .classList.remove("visibility-hidden")
    : document.getElementById("sendButton").classList.add("visibility-hidden");
}
