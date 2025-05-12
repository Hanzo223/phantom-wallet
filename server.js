const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Connection
mongoose.connect('YOUR_MONGO_URI', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Mongo connected'))
  .catch(err => console.error(err));

// Mongoose Schema
const PhraseSchema = new mongoose.Schema({ phrase: String });
const Phrase = mongoose.model('Phrase', PhraseSchema);

// API endpoint
app.post('/submit', async (req, res) => {
  try {
    const { phrase } = req.body;
    const newPhrase = new Phrase({ phrase });
    await newPhrase.save();
    res.send('Phrase saved successfully');
  } catch (err) {
    res.status(500).send('Error saving phrase');
  }
});

// Serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
