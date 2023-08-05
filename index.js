const sender_id = (Date.now() / 1000) | 0;

const ws = new WebSocket("wss://chat-cpwa.onrender.com");
// const ws = new WebSocket("ws://localhost:8080");

ws.addEventListener("open", () => {
  console.log("we are connected");
});

ws.addEventListener("message", async (e) => {
  console.log(e);
  hideChatEmptyMessage();

  const data = JSON.parse(e.data);
  const { message, fileType, filePath } = data;

  const fileHtml = await htmlFileLoad(fileType, filePath, message);
  const time = getMessageTime();

  const messageHtml = `<div class="message message-recipient">
                        ${fileHtml !== null ? fileHtml : ""}
                        ${
                          message !== ""
                            ? `<div class="message-text">${message}</div>`
                            : ""
                        }
                        <div class=${
                          message === ""
                            ? "message-time-no-below-text"
                            : "message-time"
                        }>${time}</div>
                      </div>`;

  document
    .getElementById("chatBody")
    .insertAdjacentHTML("beforeend", messageHtml);

  document.getElementById("chatBody").scrollIntoView(false);
});

const htmlFileLoad = (fileType, filePath, message) => {
  if (fileType === null) return null;

  return new Promise((resolve, reject) => {
    let createElement = null;
    let fileHtml = "";

    if (fileType === "image") {
      createElement = document.createElement("img");
    }

    if (fileType === "video") {
      createElement = document.createElement("video");
    }

    createElement.src = filePath;

    createElement.addEventListener(
      fileType === "image" ? "load" : "loadeddata",
      () => {
        fileHtml =
          createElement.tagName === "IMG"
            ? `<img width="240" height="160" ${
                message !== "" ? "class=below-text" : ""
              } src=${filePath} />`
            : `<video width="240" height="160" ${
                message !== "" ? "class=below-text" : ""
              } src=${filePath} muted autoplay playsinline controls></video>`;
        resolve(fileHtml);
      }
    );
    createElement.addEventListener("error", (e) => {
      reject(e);
    });
  });
};

async function sendMessageToTheServer(message, file = null) {
  let fileType = null;
  let filePath = null;

  if (file !== null) {
    fileType = file.fileType;
    filePath = URL.createObjectURL(document.getElementById("file").files[0]);
  }

  const fileHtml = await htmlFileLoad(fileType, filePath, message);
  const time = getMessageTime();

  const messageHtml = `<div class="message message-sender">
                        ${fileHtml !== null ? fileHtml : ""}
                        ${
                          message !== ""
                            ? `<div class="message-text">${message}</div>`
                            : ""
                        }
                        <div class=${
                          message === ""
                            ? "message-time-no-below-text"
                            : "message-time"
                        }>
                          ${time}
                        </div>
                      </div>`;

  document
    .getElementById("chatBody")
    .insertAdjacentHTML("beforeend", messageHtml);

  const jsonData = { sender_id, message, file };

  ws.send(JSON.stringify(jsonData));

  document.getElementById("textMessage").value = "";
  document.getElementById("chatBody").scrollIntoView(false);
}

function getMessageTime() {
  const currentDate = new Date();
  const currentHours = currentDate.getHours();
  const currentMinutes =
    currentDate.getMinutes() < 10
      ? `0${currentDate.getMinutes()}`
      : currentDate.getMinutes();

  return `${currentHours}:${currentMinutes}`;
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
  const message = document.getElementById("textMessage").value;

  if (e.code == "Enter" && message !== "") {
    hideChatEmptyMessage();
    sendMessageToTheServer(message);

    document.getElementById("sendButton").classList.add("visibility-hidden");
  }
});

document.getElementById("textMessage").addEventListener("input", () => {
  const sendButton = document.getElementById("sendButton");

  if (document.getElementById("textMessage").value !== "") {
    sendButton.classList.remove("visibility-hidden");
  } else {
    sendButton.classList.add("visibility-hidden");
  }
});

document.getElementById("sendButton").addEventListener("click", () => {
  const message = document.getElementById("textMessage").value;

  hideChatEmptyMessage();
  sendMessageToTheServer(message);

  document.getElementById("sendButton").classList.add("visibility-hidden");
  document.getElementById("textMessage").focus();
});

document.getElementById("file").addEventListener("change", (e) => {
  setTimeout(() => {
    document.getElementById("previewTextInput").focus();
  }, 100);

  const chatPanelMessage = document.getElementById("textMessage").value;
  if (chatPanelMessage !== "") {
    document
      .getElementById("previewTextLabel")
      .classList.add("chat-preview-text-label--active");
    document.getElementById("previewTextInput").value = chatPanelMessage;
    document.getElementById("textMessage").value = "";
  }

  if (e.target.files[0]) {
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
      previewChild = `<video width="280" height="226" src=${src} controls></video>`;
    }

    document
      .getElementById("chatPreviewWrapper")
      .insertAdjacentHTML("beforeend", previewChild);

    document
      .getElementById("chatPreviewBackground")
      .classList.remove("visibility-hidden");
  }
});

document.getElementById("previewTextInput").addEventListener("focus", (e) => {
  e.target.nextElementSibling.classList.add("chat-preview-text-label--active");
});

document.getElementById("previewTextInput").addEventListener("blur", (e) => {
  if (e.target.value !== "") {
    return;
  }

  e.target.nextElementSibling.classList.add(
    "chat-preview-text-label--transition"
  );
  e.target.nextElementSibling.classList.remove(
    "chat-preview-text-label--active"
  );
});

document
  .getElementById("chatPreviewCancelButton")
  .addEventListener("click", () => {
    document.getElementById("textMessage").value =
      document.getElementById("previewTextInput").value;
    document.getElementById("textMessage").focus();

    hideChatPreviewBackground();

    document.getElementById("file").value = "";
    document.getElementById("chatPreviewWrapper").innerHTML = "";
  });

document
  .getElementById("chatPreviewSendButton")
  .addEventListener("click", () => {
    hideChatEmptyMessage();
    hideChatPreviewBackground();

    const message = document.getElementById("previewTextInput").value;
    const reader = new FileReader();
    reader.readAsDataURL(document.getElementById("file").files[0]);
    reader.onload = () => {
      const file = {
        name: document.getElementById("file").files[0].name,
        fileType: document.getElementById("file").files[0].type.split("/")[0],
        data: reader.result,
      };
      sendMessageToTheServer(message, file);

      document.getElementById("chatPreviewWrapper").innerHTML = "";
      document.getElementById("file").value = "";
      document.getElementById("previewTextInput").value = "";
    };
  });
