const express = require('express');
const path = require('path');
const fetch = require('node-fetch');
const app = express();

const PORT = process.env.PORT || 3000;
const SELF_URL = 'https://your-render-url.onrender.com'; // Replace with actual Render URL

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Proxy route to bypass CORS when calling the MP3 API
app.post('/api/download-mp3', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'No URL provided' });

  try {
    const apiUrl = `https://api.vreden.my.id/youtube/mp3?url=${encodeURIComponent(url)}`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.status !== 200 || !data.result?.download?.url) {
      return res.status(500).json({ error: 'Failed to retrieve MP3 info' });
    }

    res.json(data.result);
  } catch (err) {
    res.status(500).json({ error: 'API call failed', details: err.message });
  }
});

// Keep app alive on Render
setInterval(() => {
  fetch(SELF_URL).then(() => console.log("Self-ping successful")).catch(() => {});
}, 1000 * 60 * 5);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});