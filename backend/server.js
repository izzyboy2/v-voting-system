const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const voteRoutes = require('./routes/voteRoutes');
const multer = require('multer');

const app = express();
const PORT = 3000;
const upload = multer({ dest: 'uploads/' });
const applications = [];

app.use(cors());
app.use(express.json());
app.use('/api', voteRoutes);

app.post('/api/apply', upload.single('document'), (req, res) => {
  const { first_name, last_name, email, phone, position, department, reason } = req.body;
  const document_path = req.file ? req.file.path : null;

  if (!first_name || !last_name || !email || !phone || !position || !department || !reason || !document_path) {
    return res.json({ success: false, message: "All fields are required." });
  }

  applications.push({
    id: applications.length + 1,
    first_name,
    last_name,
    email,
    phone,
    position,
    department,
    reason,
    document_path,
    created_at: new Date()
  });

  res.json({ success: true, message: "Application received!" });
});

mongoose.connect('mongodb://localhost:27017/student_voting', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("MongoDB connected");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => console.error(err));
