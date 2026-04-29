const socket = io("http://localhost:5000");

// ================= USER CHECK =================
const user = JSON.parse(localStorage.getItem("user"));
const chatWith = localStorage.getItem("chatWith");

if (!user) {
  window.location.href = "login.html";
}

if (!chatWith) {
  alert("No chat selected");
  window.location.href = "dashboard.html";
}

// ================= ELEMENTS =================
const msg = document.getElementById("msg");
const box = document.getElementById("box");

let isAccepted = false;


// ================= REGISTER =================
socket.emit("register", user.email);


// ================= CHECK ACCEPT =================
async function checkAccepted() {
  try {
    const res = await fetch(
      `http://localhost:5000/api/request/check/${user.email}/${chatWith}`
    );

    const data = await res.json();

    if (data.accepted) {
      isAccepted = true;
      document.getElementById("status").innerText = "✅ Chat Enabled";
    } else {
      isAccepted = false;
      document.getElementById("status").innerText =
        "⏳ Waiting for user to accept...";
    }
  } catch (err) {
    console.log("Check error");
  }
}


// ================= LOAD OLD =================
async function loadMessages() {
  try {
    const res = await fetch(
      `http://localhost:5000/api/chat/${user.email}/${chatWith}`
    );

    const data = await res.json();

    box.innerHTML =
      data.map(m => `<p><b>${m.from}:</b> ${m.message}</p>`).join("");

    scrollDown();
  } catch (err) {
    console.log("Load message error");
  }
}


// ================= SEND =================
function send() {
  const message = msg.value.trim();

  if (!message) return;

  if (!isAccepted) {
    alert("Wait until request accepted");
    return;
  }

  // 🔥 ABUSE CHECK
  const badWords = ["fuck", "abuse", "badword"];

  if (badWords.some(w => message.toLowerCase().includes(w))) {
    alert("⚠️ Abuse detected! User blocked.");

    fetch("http://localhost:5000/api/users/block", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({
        user: user.email,
        blockedUser: chatWith
      })
    });

    return;
  }

  // ✅ SOCKET SEND
  socket.emit("send_message", {
    from: user.email,
    to: chatWith,
    message
  });

  // show instantly
  box.innerHTML += `<p><b>You:</b> ${message}</p>`;

  msg.value = "";
  scrollDown();
}


// ================= RECEIVE =================
socket.on("receive_message", (data) => {
  if (
    (data.from === user.email && data.to === chatWith) ||
    (data.from === chatWith && data.to === user.email)
  ) {
    box.innerHTML += `<p><b>${data.from}:</b> ${data.message}</p>`;
    scrollDown();
  }
});


// ================= SCROLL =================
function scrollDown() {
  box.scrollTop = box.scrollHeight;
}


// ================= INIT =================
loadMessages();
checkAccepted();
setInterval(checkAccepted, 2000);