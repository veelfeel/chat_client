const sender_id = (Date.now() / 1000) | 0;

// const ws = new WebSocket("wss://chat-cpwa.onrender.com");
const ws = new WebSocket("ws://localhost:8080");

ws.addEventListener("open", () => {
  console.log("we are connected");
});

ws.addEventListener("message", async (e) => {
  hideChatEmptyMessage();

  const data = JSON.parse(e.data);
  const { message, fileType, filePath } = data;
  const newFile = await loadFile(fileType, filePath);

  // const messageHtml = `<div class="message message-recipient">
  //                           <div class=${
  //                             filePath === null && message !== ""
  //                               ? "sent-message"
  //                               : ""
  //                           }
  //                           ${
  //                             filePath !== null && message === ""
  //                               ? "sent-file"
  //                               : ""
  //                           }
  //                           ${
  //                             filePath !== null && message !== ""
  //                               ? "sent-file-message"
  //                               : ""
  //                           }
  //                           >
  //                             ${
  //                               fileType === "image"
  //                                 ? // ? `<img width="240" height="160" src=${newPath} />`
  //                                   newPath
  //                                 : ""
  //                             }
  //                             ${
  //                               fileType === "video"
  //                                 ? `<video width="240" height="160" src=${filePath} muted autoplay playsinline controls></video>`
  //                                 : ""
  //                             }
  //                             ${
  //                               filePath === null && message !== ""
  //                                 ? message
  //                                 : ""
  //                             }
  //                             ${filePath !== null && message === "" ? "" : ""}
  //                             ${
  //                               filePath !== null && message !== ""
  //                                 ? `<div class="sent-file-text">${message}</div>`
  //                                 : ""
  //                             }
  //                             <span>${getMessageTime()}</span>
  //                           </div>
  //                         </div>`;
  const messageHtml = newFile;

  document
    .getElementById("chatBody")
    .insertAdjacentHTML("beforeend", messageHtml);

  document.getElementById("chatBody").scrollIntoView(false);

  // const textHtml =
  //   message !== "" ? `<div class="sent-file-text">${message}</div>` : "";

  // if (fileType !== null) {
  //   let fileHtml = "";

  //   const createElement = document.createElement(
  //     `${fileType === "image" ? "img" : "video"}`
  //   );
  //   createElement.src = filePath;
  //   createElement.addEventListener(
  //     fileType === "image" ? "load" : "loadeddata",
  //     () => {
  //       fileHtml =
  //         fileType === "image"
  //           ? `<img width="240" height="160" src=${filePath} />`
  //           : `<video width="240" height="160" src=${filePath} muted autoplay playsinline controls></video>`;

  //       const messageHtml = `<div class="message message-recipient">
  //                             <div class=${
  //                               filePath !== null && message !== ""
  //                                 ? "sent-file-message"
  //                                 : "sent-message"
  //                             }>
  //                               ${fileHtml}
  //                               ${textHtml}
  //                               <span>${getMessageTime()}</span>
  //                             </div>
  //                           </div>`;

  //       document
  //         .getElementById("chatBody")
  //         .insertAdjacentHTML("beforeend", messageHtml);

  //       document.getElementById("chatBody").scrollIntoView(false);
  //     }
  //   );
  // }
});

const loadFile = (fileType, filePath) => {
  return new Promise((resolve, reject) => {
    let html = "";
    const createElement = document.createElement(
      `${fileType === "image" ? "img" : "video"}`
    );
    createElement.src = filePath;
    if (createElement.tagName === "IMG") {
      html = `<img width="240" height="160" src=${filePath} />`;
    }

    if (createElement.tagName === "VIDEO") {
      html = `<video width="240" height="160" src=${filePath} muted autoplay playsinline controls></video>`;
    }

    createElement.addEventListener(
      fileType === "image" ? "load" : "loadeddata",
      () => {
        resolve(html);
      }
    );
    createElement.addEventListener("error", (e) => {
      reject(e);
    });
    // const img = new Image();
    // img.src = filePath;
    // img.onload = () => {
    //   resolve(img);
    // };
    // img.onerror = (e) => {
    //   reject(e);
    // };
  });
};

function sendMessageToTheServer(message, file = null) {
  let filePath;

  if (file !== null) {
    filePath = URL.createObjectURL(document.getElementById("file").files[0]);
    document.getElementById("file").value = "";
  }

  // const currentDate = new Date();
  // const currentHours = currentDate.getHours();
  // const currentMinutes =
  //   currentDate.getMinutes() < 10
  //     ? `0${currentDate.getMinutes()}`
  //     : currentDate.getMinutes();
  // const hoursAndMinutes = `${currentHours}:${currentMinutes}`;

  // const messageHtml = `<div class="message message-sender">
  //                         <div class=${
  //                           file !== null && message !== ""
  //                             ? "sent-file-message"
  //                             : file !== null && message === ""
  //                             ? "sent-file"
  //                             : file === null && message !== ""
  //                             ? "sent-message"
  //                             : ""
  //                         }

  //                         >
  //                           ${
  //                             file !== null && file.type === "image"
  //                               ? `<img width="240" height="160" src=${filePath} />`
  //                               : ""
  //                           }
  //                           ${
  //                             file !== null && file.type === "video"
  //                               ? `<video width="240" height="160" src=${filePath} muted autoplay playsinline controls></video>`
  //                               : ""
  //                           }
  //                           <div ${
  //                             file !== null ? `class="sent-file-text"` : ""
  //                           }>${message}</div><span>${hoursAndMinutes}</span>
  //                       </div>
  //                     </div>`;

  // document
  //   .getElementById("chatBody")
  //   .insertAdjacentHTML("beforeend", messageHtml);

  document.getElementById("chatBody").scrollIntoView(false);

  // document.getElementById("textMessage").value = "";

  const jsonData = { sender_id, message, file };

  ws.send(JSON.stringify(jsonData));
}

// function renderHtml(fileType, filePath, message) {
//   let fileHtml = "";
//   let textHtml = "";

//   if (fileType === null && message !== "") {
//     console.log("файла нет, сообщение есть");
//   }

//   if (fileType !== null && message === "") {
//     console.log("файл есть, сообщения нет");
//   }

//   if (fileType !== null && message !== "") {
//     console.log("файл есть, сообщение есть");
//   }

//   const messageHtml = `<div class="message message-sender"></div>`;
//   document
//     .getElementById("chatBody")
//     .insertAdjacentHTML("beforeend", messageHtml);
// }

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
      sendMessageToTheServer(message, {
        name: document.getElementById("file").files[0].name,
        type: document.getElementById("file").files[0].type.split("/")[0],
        data: reader.result,
      });
    };

    document.getElementById("chatPreviewWrapper").innerHTML = "";
  });
