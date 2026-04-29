const API = "http://localhost:5000/api/auth";

// REGISTER
async function register() {
  await fetch(`${API}/register`, {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({
      name: name.value,
      email: email.value,
      password: password.value
    })
  });

  alert("Registered Successfully");
  window.location.href = "login.html";
}

// LOGIN
async function login() {
  const res = await fetch(`${API}/login`, {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({
      email: email.value,
      password: password.value
    })
  });

  const data = await res.json();

  if (data.token) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    window.location.href = "dashboard.html";
  } else {
    alert(data.msg);
  }
}