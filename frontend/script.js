// Dummy candidate data
const candidates = [
  { id: 1, name: "Alice Johnson" },
  { id: 2, name: "Bob Smith" },
  { id: 3, name: "Cynthia Lee" }
];

let hasVoted = false;
let regNo = localStorage.getItem("regNo") || null;

async function login() {
  const regNoInput = document.getElementById("loginEmail").value.trim(); // or use loginRegNo if that's your input's id
  const password = document.getElementById("loginPassword").value;
  if (!regNoInput || !password) {
    document.getElementById("login-error").innerText = "All fields are required.";
    document.getElementById("login-error").style.display = "block";
    return;
  }

  const res = await fetch("http://192.168.43.36:3000/api/login", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ regNo: regNoInput, password })
  });

  const data = await res.json();
  if (data && data.regNo) {
    localStorage.setItem("regNo", data.regNo); // Store for dashboard
    window.location.href = "dashboard.html"; // Redirect to dashboard
  } else {
    document.getElementById("login-error").innerText = data.message || "Login failed.";
    document.getElementById("login-error").style.display = "block";
  }
}

async function loadCandidates() {
  const res = await fetch("http://192.168.43.36:3000/api/applications");
  const data = await res.json();

  const container = document.getElementById("candidates-list");
  container.innerHTML = "";

  data.forEach(candidate => {
    const div = document.createElement("div");
    div.className = "candidate";
    div.innerHTML = `
      <span>${candidate.first_name} ${candidate.last_name}</span>
      <button onclick="vote('${candidate.id}')" ${hasVoted ? "disabled" : ""}>Vote</button>
    `;
    container.appendChild(div);
  });
}

// Note: You need to implement /api/vote in your backend for this to work!
async function vote(candidateId) {
  if (hasVoted) return;

  const regNo = localStorage.getItem("regNo");
  const res = await fetch("http://192.168.43.36:3000/api/vote", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ regNo, candidateId })
  });

  const data = await res.json();
  hasVoted = true;
  document.getElementById("vote-message").innerText = data.message;
  loadCandidates();
}

function logout() {
  hasVoted = false;
  regNo = null;
  localStorage.removeItem("regNo");
  document.getElementById("login-section").style.display = "block";
  document.getElementById("vote-section").style.display = "none";
}

function showRegister() {
  document.getElementById("login-section").style.display = "none";
  document.getElementById("register-section").style.display = "flex";
}

function showLogin() {
  document.getElementById("register-section").style.display = "none";
  document.getElementById("login-section").style.display = "flex";
}

// Example register function (implement backend as needed)
async function register() {
  const regNoInput = document.getElementById("registerStudentId").value.trim();
  const password = document.getElementById("registerPassword").value;
  if (!regNoInput || !password) {
    document.getElementById("register-error").innerText = "All fields are required.";
    document.getElementById("register-error").style.display = "block";
    return;
  }

  const res = await fetch("http://192.168.43.36:3000/api/register", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ regNo: regNoInput, password })
  });

  const data = await res.json();
  if (data.success) {
    document.getElementById("register-error").style.display = "none";
    alert("Registration successful! Please login.");
    showLogin();
  } else {
    document.getElementById("register-error").innerText = data.message || "Registration failed.";
    document.getElementById("register-error").style.display = "block";
  }
}
