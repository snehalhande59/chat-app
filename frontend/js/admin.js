// const API = "http://localhost:5000/api";

// // ================= AUTH CHECK =================
// const user = JSON.parse(localStorage.getItem("user"));

// if (!user || user.role !== "admin") {
//   alert("Access denied");
//   window.location.href = "login.html";
// }


// // ================= LOAD USERS =================
// async function loadUsers() {
//   try {
//     const res = await fetch(`${API}/users`);
//     const data = await res.json();

//     document.getElementById("users").innerHTML =
//       data.map(u => `
//         <div class="card">
//           <b>${u.name}</b><br>
//           ${u.email}<br>

//           <button onclick="removeUser('${u._id}')">
//             ❌ Remove
//           </button>
//         </div>
//       `).join("");

//   } catch (err) {
//     alert("Error loading users");
//   }
// }


// // ================= DELETE USER =================
// async function removeUser(id) {
//   if (!confirm("Delete this user?")) return;

//   try {
//     const res = await fetch(`${API}/users/${id}`, {
//       method: "DELETE"
//     });

//     const data = await res.json();

//     alert(data.msg || "User removed");

//     loadUsers(); // refresh list

//   } catch (err) {
//     alert("Delete failed");
//   }
// }


// // ================= LOGOUT =================
// function logout() {
//   localStorage.clear();
//   window.location.href = "login.html";
// }


// // ================= INIT =================
// loadUsers();



const API = "http://localhost:5000/api";

// ================= AUTH CHECK =================
const user = JSON.parse(localStorage.getItem("user"));

if (!user || user.role !== "admin") {
  alert("Access denied");
  window.location.href = "login.html";
}


// ================= LOAD USERS =================
async function loadUsers() {
  try {
    const res = await fetch(`${API}/users`);
    const data = await res.json();

    document.getElementById("users").innerHTML =
      data.map(u => `
        <div class="card">
          <b>${u.name}</b><br>
          ${u.email}<br>

          <button onclick="removeUser('${u._id}')">
            ❌ Remove
          </button>
        </div>
      `).join("");

  } catch (err) {
    alert("Error loading users");
  }
}


// ================= ADD USER =================
async function addUser() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!name || !email || !password) {
    return alert("All fields required");
  }

  try {
    const res = await fetch(`${API}/auth/register`, {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({
        name,
        email,
        password
      })
    });

    const data = await res.json();

    if (!res.ok) {
      return alert(data.msg);
    }

    alert("User added successfully");

    // clear inputs
    document.getElementById("name").value = "";
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";

    loadUsers(); // refresh list

  } catch (err) {
    alert("Add user failed");
  }
}


// ================= DELETE USER =================
async function removeUser(id) {
  if (!confirm("Delete this user?")) return;

  try {
    const res = await fetch(`${API}/users/${id}`, {
      method: "DELETE"
    });

    const data = await res.json();

    alert(data.msg || "User removed");

    loadUsers();

  } catch (err) {
    alert("Delete failed");
  }
}


// ================= LOGOUT =================
function logout() {
  localStorage.clear();
  window.location.href = "login.html";
}


// ================= INIT =================
loadUsers();