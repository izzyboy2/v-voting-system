let studentId = localStorage.getItem("studentId"); // Get from login
let hasVoted = false;

async function fetchStudentInfo() {
  const res = await fetch("http://192.168.43.36:3000/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ studentId })
  });

  const data = await res.json();
  hasVoted = data.hasVoted;
  document.getElementById("vote-status").innerText = hasVoted ? "Already Voted" : "Not Voted";
}

async function fetchCandidates() {
  const res = await fetch("http://192.168.43.36:3000/api/candidates");
  const data = await res.json();

  const container = document.getElementById("candidate-list");
  container.innerHTML = "";

  data.forEach(candidate => {
    const div = document.createElement("div");
    div.className = "candidate-card";
    div.innerHTML = `
      <span>${candidate.name}</span>
      <button ${hasVoted ? "disabled" : ""} onclick="vote(${candidate.id})">Vote</button>
    `;
    container.appendChild(div);
  });
}

async function vote(candidateId) {
  const res = await fetch("http://192.168.43.36:3000/api/vote", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ studentId, candidateId })
  });

  const data = await res.json();
  alert(data.message);
  hasVoted = true;
  document.getElementById("vote-status").innerText = "Already Voted";
  fetchCandidates();
}

async function loadApplications() {
  const res = await fetch("http://192.168.43.36:3000/api/applications");
  const data = await res.json();
  const container = document.getElementById("candidate-list");
  container.innerHTML = "";

  data.forEach(app => {
    const div = document.createElement("div");
    div.className = "candidate-card";
    div.innerHTML = `
      <span>${app.first_name} ${app.last_name}</span>
      <p><strong>Position:</strong> ${app.position}</p>
      <p><strong>Department:</strong> ${app.department}</p>
      <p><strong>Reason:</strong> ${app.reason}</p>
      <a href="${app.document_path}" target="_blank">View Document</a>
    `;
    container.appendChild(div);
  });
}

// Call this function on dashboard load
document.addEventListener("DOMContentLoaded", loadApplications);

function logout() {
  localStorage.removeItem("studentId");
  window.location.href = "index.html"; // Redirect to login
}

// Initialize on page load
if (!studentId) {
  window.location.href = "index.html";
} else {
  fetchStudentInfo();
  fetchCandidates();
}

// Example: Fetch all candidates/applications from your backend

fetch("http://192.168.43.36:3000/api/applications")
  .then(response => response.json())
  .then(data => {
    // Populate your dashboard with the data
    const candidateList = document.getElementById("candidate-list");
    candidateList.innerHTML = "";
    data.forEach(candidate => {
      const div = document.createElement("div");
      div.className = "candidate-card";
      div.innerHTML = `
        <h3>${candidate.first_name} ${candidate.last_name}</h3>
        <p>Position: ${candidate.position}</p>
        <p>Department: ${candidate.department}</p>
        <p>Email: ${candidate.email}</p>
      `;
      candidateList.appendChild(div);
    });
  })
  .catch(error => {
    console.error("Error fetching candidates:", error);
  });
