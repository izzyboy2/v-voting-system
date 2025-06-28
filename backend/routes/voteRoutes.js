const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Vote = require('../models/Vote');

// Simulated candidates
const candidates = [
  { id: 1, name: "Alice Johnson" },
  { id: 2, name: "Bob Smith" },
  { id: 3, name: "Cynthia Lee" }
];

// Login/register
router.post('/login', async (req, res) => {
  const { studentId } = req.body;

  let user = await User.findOne({ studentId });
  if (!user) {
    user = new User({ studentId });
    await user.save();
  }

  res.json({ studentId: user.studentId, hasVoted: user.hasVoted });
});

// Get candidates
router.get('/candidates', (req, res) => {
  res.json(candidates);
});

// Cast vote
router.post('/vote', async (req, res) => {
  const { studentId, candidateId } = req.body;

  const user = await User.findOne({ studentId });
  if (!user || user.hasVoted) {
    return res.status(400).json({ error: 'Already voted or invalid user' });
  }

  const vote = new Vote({ studentId, candidateId });
  await vote.save();

  user.hasVoted = true;
  await user.save();

  res.json({ message: 'Vote recorded successfully' });
});

module.exports = router;
