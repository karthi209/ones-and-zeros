const express = require("express");
const db = require('./db');
const cors = require('cors');
const bodyParser = require('body-parser');
const PORT = 3000;
const HOST = '0.0.0.0';

const app = express();

// Configure CORS for a specific domain
const corsOptions = { origin: '*' };


app.use(cors(corsOptions));
app.use(bodyParser.json());

app.use('/images', express.static('media/thumbnails'));

app.get('/bloglist', async (req, res) => {
  const searchQuery = req.query.query || "";

  try {
    const limit = 12;  // Set a limit on the number of rows returned

    const data = await db.query(
      `SELECT postid, title, author, publicationdate 
       FROM Post 
       ${searchQuery ? 'WHERE title ILIKE $1' : ''} 
       ORDER BY postid ASC
       LIMIT $${searchQuery ? 2 : 1}`,
      searchQuery ? [`%${searchQuery}%`, limit] : [limit]
    );

    res.json(data.rows);

  } catch (err) {
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'An error occurred while processing your request.',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
    console.log(err);
  }
});

app.post('/data', async (req, res) => {
  const { integerValue } = req.body;
  console.log('Received integerValue:', integerValue);

  try {
    const data = await db.query('SELECT * FROM Post WHERE postid = $1;', [integerValue]);
    res.json(data.rows);

  } catch (err) {
    res.status(500).send(err);
    console.log(err);
  }
});

app.listen(PORT, HOST, () => console.log(`Listening on http://${HOST}:${PORT}/`));
