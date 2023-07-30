const sender_id = (Date.now() / 1000) | 0;

const ws = new WebSocket("ws://localhost:8080");
ws.addEventListener("open", () => {
  console.log("we are connected");
});

ws.addEventListener("message", (e) => {
  const data = JSON.parse(e.data);
  const { message, type, filePath } = data;
  console.log(message, type, filePath);

  if (message !== "" || filePath !== "") {
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
  let imageSrc;

  if (file !== null) {
    imageSrc = URL.createObjectURL(document.getElementById("file").files[0]);
    document.getElementById("file").value = "";
  }

  document.getElementById("chatPreview").classList.add("visibility-hidden");

  if (message !== "" || file !== "") {
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
                              file !== null &&
                              `<img width="240" src=${imageSrc} />`
                            }
                            ${message} <span>${hoursAndMinutes}</span></div>
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

    let previewChild = "";
    const src = URL.createObjectURL(e.target.files[0]);
    const type = e.target.files[0].type.split("/")[0];

    if (type === "image") {
      previewChild = `<img id="chatPreviewImage" width="280" height="186" src=${src} />`;
    } else if (type === "video") {
      previewChild = `<video id="chatPreviewVideo" width="280" height="186" src=${src} controls></video>`;
    }

    document
      .getElementById("chatPreviewWrapper")
      .insertAdjacentHTML("beforeend", previewChild);
  }
});

document
  .getElementById("chatPreviewSendButton")
  .addEventListener("click", () => {
    const reader = new FileReader();
    reader.readAsDataURL(document.getElementById("file").files[0]);
    reader.onload = () => {
      sendMessageToTheServer({
        name: document.getElementById("file").files[0].name,
        type: document.getElementById("file").files[0].type.split("/")[0],
        data: reader.result,
      });
    };
  });

document
  .getElementById("chatPreviewCancelButton")
  .addEventListener("click", () => {
    document.getElementById("chatPreview").classList.add("visibility-hidden");
    document.getElementById("file").value = "";
    document.getElementById("chatPreviewWrapper").innerHTML = "";
  });
