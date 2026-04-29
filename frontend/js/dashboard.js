const API = "http://localhost:5000/api";

// ================= AUTH CHECK =================
const user = JSON.parse(localStorage.getItem("user"));

if (!user) {
  alert("Login first");
  window.location.href = "login.html";
}

// 👉 ADMIN REDIRECT (IMPORTANT)
if (user.role === "admin") {
  window.location.href = "admin.html";
}


// ================= SHOW MY EMAIL =================
document.getElementById("myEmail").innerText = user.email;


// ================= LOAD USERS =================
async function loadUsers() {
  const res = await fetch(`${API}/users`);
  const data = await res.json();

  document.getElementById("users").innerHTML =
    data
      .filter(u => u.email !== user.email)
      .map(u => `
        <div class="card">
          <b>${u.name}</b><br>
          ${u.email}<br>

          <button onclick="sendReq('${u.email}')">
            Send Request
          </button>
        </div>
      `).join("");
}


// ================= SEND REQUEST + OPEN CHAT =================
async function sendReq(to) {
  await fetch(`${API}/request/send`, {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({
      from: user.email,
      to
    })
  });

  localStorage.setItem("chatWith", to);
  window.location.href = "chat.html";
}


// ================= LOAD REQUESTS =================
async function loadRequests() {
  const res = await fetch(`${API}/request/${user.email}`);
  const data = await res.json();

  const pending = data.filter(r =>
    r.to === user.email && r.status === "pending"
  );

  document.getElementById("requests").innerHTML =
    pending.map(r => `
      <div class="card">
        <b>${r.from}</b>

        <button onclick="accept('${r.from}')">
          Accept
        </button>

        <button onclick="openChat('${r.from}')">
          Chat
        </button>
      </div>
    `).join("");
}


// ================= ACCEPT =================
async function accept(from) {
  await fetch(`${API}/request/accept`, {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({
      from,
      to: user.email
    })
  });

  alert("Request Accepted");

  localStorage.setItem("chatWith", from);
  window.location.href = "chat.html";
}


// ================= OPEN CHAT =================
function openChat(email) {
  localStorage.setItem("chatWith", email);
  window.location.href = "chat.html";
}


// ================= LOGOUT =================
async function logout() {
  try {
    await fetch(`${API}/users/lastseen`, {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ email: user.email })
    });
  } catch (err) {
    console.log("Last seen update failed");
  }

  localStorage.clear();
  window.location.href = "login.html";
}


// ================= INIT =================
loadUsers();
loadRequests();

// auto refresh
setInterval(loadRequests, 3000);