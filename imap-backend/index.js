require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { fetchCalendarEvents } = require('./imapService');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/events', async (req, res) => {
  try {
    const events = await fetchCalendarEvents();
    res.json(events);
  } catch (error) {
    console.error('❌ Failed to fetch events:', error.message);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

app.post('/token', async (req, res) => {
  console.log('🔔 /token route hit!');
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: 'Missing code' });
  }

  console.log(`✅ Received auth code: ${code}`);

  // Simulate token exchange
  return res.json({ token: 'mock-access-token' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`📬 IMAP server running on http://localhost:${PORT}`);
});