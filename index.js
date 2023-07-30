const sender_id = (Date.now() / 1000) | 0;

const ws = new WebSocket("wss://chat-cpwa.onrender.com");
ws.addEventListener("open", () => {
  console.log("we are connected");
});

ws.addEventListener("message", (e) => {
  hideChatEmptyMessage();

  const data = JSON.parse(e.data);
  const { message, type, filePath } = data;

  const currentDate = new Date();
  const currentHours = currentDate.getHours();
  const currentMinutes =
    currentDate.getMinutes() < 10
      ? `0${currentDate.getMinutes()}`
      : currentDate.getMinutes();
  const hoursAndMinutes = `${currentHours}:${currentMinutes}`;
  const messageHtml = `<div class="message message-recipient">
                            <div class=${
                              filePath !== ""
                                ? "sent-message-image"
                                : "sent-message"
                            }>
                              ${
                                type === "image"
                                  ? `<img width="240" src=${filePath} />`
                                  : ""
                              }
                              ${
                                type === "video"
                                  ? `<video width="240" src=${filePath} controls></video>`
                                  : ""
                              }
                              ${
                                message !== "" ? `<div>${message}</div>` : ""
                              } <span>${hoursAndMinutes}</span>
                            </div>
                          </div>`;
  document
    .getElementById("chatBody")
    .insertAdjacentHTML("beforeend", messageHtml);
});

function sendMessageToTheServer(file = null) {
  const message = document.getElementById("textMessage").value;
  let filePath;

  if (file !== null) {
    filePath = URL.createObjectURL(document.getElementById("file").files[0]);
    document.getElementById("file").value = "";
  }

  const currentDate = new Date();
  const currentHours = currentDate.getHours();
  const currentMinutes =
    currentDate.getMinutes() < 10
      ? `0${currentDate.getMinutes()}`
      : currentDate.getMinutes();
  const hoursAndMinutes = `${currentHours}:${currentMinutes}`;

  const messageHtml = `<div class="message message-sender">
                          <div class=${
                            file !== null
                              ? "sent-message-image"
                              : "sent-message"
                          }>
                            ${
                              file !== null && file.type === "image"
                                ? `<img width="240" src=${filePath} />`
                                : ""
                            }
                            ${
                              file !== null && file.type === "video"
                                ? `<video width="240" src=${filePath} controls></video>`
                                : ""
                            }
                            ${message} <span>${hoursAndMinutes}</span></div>
                        </div>`;

  document
    .getElementById("chatBody")
    .insertAdjacentHTML("beforeend", messageHtml);

  document.getElementById("textMessage").value = "";

  const jsonData = { sender_id: sender_id, message: message, file };

  ws.send(JSON.stringify(jsonData));
}

function hideChatEmptyMessage() {
  if (
    !document
      .getElementById("chatEmptyMessage")
      .classList.contains("visibility-hidden")
  ) {
    document
      .getElementById("chatEmptyMessage")
      .classList.add("visibility-hidden");
  }
}

function hideChatPreviewBackground() {
  document
    .getElementById("chatPreviewBackground")
    .classList.add("visibility-hidden");
}

document.getElementById("textMessage").addEventListener("keydown", (e) => {
  if (
    e.code == "Enter" &&
    document.getElementById("textMessage").value !== ""
  ) {
    sendMessageToTheServer();
  }
});

document.getElementById("textMessage").addEventListener("input", () => {
  if (document.getElementById("textMessage").value !== "") {
    document.getElementById("sendButton").classList.remove("visibility-hidden");
  } else {
    document.getElementById("sendButton").classList.add("visibility-hidden");
  }
});

document
  .getElementById("sendButton")
  .addEventListener("click", sendMessageToTheServer);

document.getElementById("file").addEventListener("change", (e) => {
  if (e.target.files[0]) {
    document
      .getElementById("chatPreviewBackground")
      .classList.remove("visibility-hidden");

    let previewChild = "";
    const src = URL.createObjectURL(e.target.files[0]);
    const type = e.target.files[0].type.split("/")[0];

    if (type === "image") {
      document.getElementById("chatPreviewTitle").textContent =
        "Отправить изображение";
      previewChild = `<img id="chatPreviewImage" width="280" height="226" src=${src} />`;
    } else if (type === "video") {
      document.getElementById("chatPreviewTitle").textContent =
        "Отправить видео";
      previewChild = `<video id="chatPreviewVideo" width="280" height="226" src=${src} controls></video>`;
    }

    document
      .getElementById("chatPreviewWrapper")
      .insertAdjacentHTML("beforeend", previewChild);
  }
});

document
  .getElementById("chatPreviewCancelButton")
  .addEventListener("click", () => {
    hideChatPreviewBackground();

    document.getElementById("file").value = "";
    document.getElementById("chatPreviewWrapper").innerHTML = "";
  });

document
  .getElementById("chatPreviewSendButton")
  .addEventListener("click", () => {
    hideChatEmptyMessage();
    hideChatPreviewBackground();

    const reader = new FileReader();
    reader.readAsDataURL(document.getElementById("file").files[0]);
    reader.onload = () => {
      sendMessageToTheServer({
        name: document.getElementById("file").files[0].name,
        type: document.getElementById("file").files[0].type.split("/")[0],
        data: reader.result,
      });
    };

    document.getElementById("chatPreviewWrapper").innerHTML = "";
  });
