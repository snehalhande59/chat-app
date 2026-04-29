const email = document.getElementById("email");
const password = document.getElementById("password");

async function login() {
  const res = await fetch("http://localhost:5000/api/auth/login", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({
      email: email.value,
      password: password.value
    })
  });

  const data = await res.json();

  if (!res.ok) {
    return alert(data.msg);
  }

  localStorage.setItem("user", JSON.stringify(data.user));

  // 🔥 correct redirect
  if (data.user.role === "admin") {
    window.location.href = "admindashboard.html";
  } else {
    window.location.href = "dashboard.html";
  }
}