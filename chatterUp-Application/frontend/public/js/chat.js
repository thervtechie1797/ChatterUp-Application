document.addEventListener("DOMContentLoaded", () => {
  const socket = io();

  const username = localStorage.getItem("username");
  if (!username) {
    username = prompt("Enter your name");
    localStorage.setItem("username", username);
  }

  socket.emit("setUsername", username);

  const profilePic = localStorage.getItem("profilePic") || "";

  document.getElementById("username-display").textContent = username;

  const messageForm = document.getElementById("message-form");
  const messageInput = document.getElementById("message-input");
  const messageDiv = document.getElementById("messages");

  const typingIndicator = document.getElementById("typing");

  let typingTimeout;

  socket.on("userCount", (count) => {
    const userCountElement = document.getElementById("userCount");
    if (userCountElement) {
      userCountElement.innerText = `👥 Users online: ${count}`;
    }
  });

  socket.on("notification", (message) => {
    displayNotification(message);
  });

  displayNotification = (message) => {
    const div = document.createElement("div");
    div.classList.add("notification");
    div.innerHTML = `<p style="color: gray; font-style: italic;">${message}</p>`;
    messageDiv.appendChild(div);
    messageDiv.scrollTop = messageDiv.scrollHeight;
  };

  messageInput.addEventListener("input", () => {
    console.log("Typing...");
    socket.emit("typing", username);

    clearTimeout(typingTimeout);

    typingTimeout = setTimeout(() => {
      socket.emit("stopTyping", username);
    }, 1000);
  });

  messageForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const message = messageInput.value;

    socket.emit("chatMessage", {
      user: username,
      text: message,
      profilePic: profilePic,
      time: new Date().toLocaleTimeString(),
    });
    messageInput.value = "";
    socket.emit("stopTyping", username);
  });

  socket.on("chatMessage", (msg) => {
    console.log("Received message:", msg);

    const div = document.createElement("div");
    div.classList.add("message");
    div.innerHTML = `
    <div style="display:flex; align-items:flex-start; gap:10px;">
      <img src="${
        msg.profilePic || "https://via.placeholder.com/40"
      }" alt="pic" width="40" height="40" style="border-radius:50%;">
      <div class="message-content">
        <strong>${msg.user}</strong> <small>[${msg.time}]</small><br/> 
        ${msg.text}
      </div>
    </div>
  `;
    messageDiv.appendChild(div);
    messageDiv.scrollTop = messageDiv.scrollHeight;
  });

  // ✅ Request previous messages from server
  socket.emit("getMessages");

  // ✅ Display previous messages
  socket.on("previousMessages", (messages) => {
    messages.forEach((msg) => {
      const div = document.createElement("div");
      div.classList.add("message");
      div.innerHTML = `
        <div style="display:flex; align-items:flex-start; gap:10px;">
          <img src="${
            msg.profilePic || "https://via.placeholder.com/40"
          }" alt="pic" width="40" height="40" style="border-radius:50%;">
          <div class="message-content">
            <strong>${msg.sender}</strong> <small>[${new Date(
        msg.timestamp
      ).toLocaleTimeString()}]</small><br/> 
            ${msg.content}
          </div>
        </div>
      `;
      messageDiv.appendChild(div);
    });
    messageDiv.scrollTop = messageDiv.scrollHeight;
  });

  socket.on("userTyping", (user) => {
    if (user != username) {
      typingIndicator.innerText = `${user} is typing...`;
    }
  });

  socket.on("userStopTyping", (user) => {
    if (user != username) {
      typingIndicator.innerText = "";
    }
  });
});
