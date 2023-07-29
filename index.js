const sender_id = (Date.now() / 1000) | 0;

const ws = new WebSocket("ws://localhost:8080");
ws.addEventListener("open", () => {
  console.log("we are connected");
});

ws.addEventListener("message", (e) => {
  const data = JSON.parse(e.data);

  if (data.message !== "") {
    const currentDate = new Date();
    const currentHours = currentDate.getHours();
    const currentMinutes =
      currentDate.getMinutes() < 10
        ? `0${currentDate.getMinutes()}`
        : currentDate.getMinutes();
    const hoursAndMinutes = `${currentHours}:${currentMinutes}`;

    const messageHtml = `<div class="message message-recipient">
    <div class="sent-message">${data.message} <span>${hoursAndMinutes}</span></div>
    </div>`;

    document
      .getElementById("chatBody")
      .insertAdjacentHTML("beforeend", messageHtml);

    document
      .getElementById("chatEmptyMessage")
      .classList.add("visibility-hidden");
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

function sendMessageToTheServer(file = null) {
  const message = document.getElementById("textMessage").value;

  if (message !== "") {
    const currentDate = new Date();
    const currentHours = currentDate.getHours();
    const currentMinutes =
      currentDate.getMinutes() < 10
        ? `0${currentDate.getMinutes()}`
        : currentDate.getMinutes();
    const hoursAndMinutes = `${currentHours}:${currentMinutes}`;

    const messageHtml = `<div class="message message-sender">
                          <div class="sent-message">${message} <span>${hoursAndMinutes}</span></div>
                        </div>`;

    document
      .getElementById("chatBody")
      .insertAdjacentHTML("beforeend", messageHtml);

    document
      .getElementById("chatEmptyMessage")
      .classList.add("visibility-hidden");
  }

  const jsonData = { sender_id: sender_id, message: message, file };

  ws.send(JSON.stringify(jsonData));

  document.getElementById("textMessage").value = "";

  hideShowSendButton();
}

document
  .getElementById("textMessage")
  .addEventListener("input", hideShowSendButton);

function hideShowSendButton() {
  if (
    document.getElementById("textMessage").value !== "" ||
    document.getElementById("file").value !== ""
  ) {
    document.getElementById("sendButton").classList.remove("visibility-hidden");
  } else {
    document.getElementById("sendButton").classList.add("visibility-hidden");
  }
}

document.getElementById("file").addEventListener("change", (e) => {
  if (e.target.files[0]) {
    document
      .getElementById("chatEmptyMessage")
      .classList.add("visibility-hidden");

    document
      .getElementById("chatPreview")
      .classList.remove("visibility-hidden");

    const src = URL.createObjectURL(e.target.files[0]);
    const preview = document.getElementById("chatPreviewImage");
    preview.src = src;
    // preview.style.display = "block";
  }

  // const reader = new FileReader();
  // reader.readAsDataURL(e.target.files[0]);
  // reader.onload = () => {
  //   sendMessageToTheServer({
  //     name: e.target.files[0].name,
  //     data: reader.result,
  //   });
  // };
});
