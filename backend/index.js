const express = require('express');
const cors = require('cors');
const multer = require('multer');
const admin = require('firebase-admin');
const serviceAccount = require('./voting-system-b2086-firebase-adminsdk-fbsvc-1077f983ac.json');

const app = express();
const PORT = 3000;

app.use(cors());
app.use('/uploads', express.static('uploads')); // Serve uploaded files
app.use(express.json());
const upload = multer({ dest: 'uploads/' });

// Firebase Admin SDK initialization
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://voting-system-b2086-default-rtdb.firebaseio.com"
});

const db = admin.database();

// Register endpoint (Firebase)
app.post('/api/register', async (req, res) => {
  const { regNo, password } = req.body;
  if (!regNo || !password) {
    return res.json({ success: false, message: "All fields are required." });
  }
  const userRef = db.ref('users/' + regNo.replace(/\./g, '_'));
  const snapshot = await userRef.once('value');
  if (snapshot.exists()) {
    return res.json({ success: false, message: "Registration number already registered." });
  }
  await userRef.set({ regNo, password });
  res.json({ success: true, message: "Registered!" });
});

// Login endpoint (Firebase)
app.post('/api/login', async (req, res) => {
  const { regNo, password } = req.body;
  const userRef = db.ref('users/' + regNo.replace(/\./g, '_'));
  const snapshot = await userRef.once('value');
  const user = snapshot.val();
  if (!user || user.password !== password) {
    return res.json({ success: false, message: "Invalid credentials." });
  }
  res.json({ regNo: user.regNo, hasVoted: false });
});

// Application submission endpoint (Firebase)
app.post('/api/apply', upload.single('document'), async (req, res) => {
  const { first_name, last_name, email, phone, position, department, reason } = req.body;
  const document_path = req.file ? req.file.path : null;

  if (!first_name || !last_name || !email || !phone || !position || !department || !reason || !document_path) {
    return res.json({ success: false, message: "All fields are required." });
  }

  const newAppRef = db.ref('applications').push();
  await newAppRef.set({
    first_name,
    last_name,
    email,
    phone,
    position,
    department,
    reason,
    document_path,
    created_at: new Date().toISOString()
  });

  res.json({ success: true, message: "Application received!" });
});

// Fetch all applications (Firebase)
app.get('/api/applications', async (req, res) => {
  const snapshot = await db.ref('applications').once('value');
  const apps = snapshot.val() || {};
  // Convert object to array and sort by created_at descending
  const appList = Object.values(apps).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  res.json(appList);
});

// Voting endpoint (Firebase)
app.post('/api/vote', async (req, res) => {
  const { regNo, candidateId } = req.body;
  if (!regNo || !candidateId) {
    return res.json({ success: false, message: "All fields are required." });
  }

  // Check if user has already voted
  const voteRef = db.ref('votes/' + regNo.replace(/\./g, '_'));
  const snapshot = await voteRef.once('value');
  if (snapshot.exists()) {
    return res.json({ success: false, message: "You have already voted." });
  }

  // Save the vote
  await voteRef.set({
    regNo,
    candidateId,
    votedAt: new Date().toISOString()
  });

  res.json({ success: true, message: "Vote submitted successfully!" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});