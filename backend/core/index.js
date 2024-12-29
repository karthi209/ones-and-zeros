const express = require("express");
const db = require('./db');
const cors = require('cors');
const bodyParser = require('body-parser');
const PORT = 3000;
const HOST = '0.0.0.0';

const app = express();

// Configure CORS for specific domains
const allowedOrigins = [
  'http://144.126.254.165',
  'http://144.126.254.165:80',
  'http://theonesandzeros.com:80',
  'https://theonesandzeros.com:443',
  'http://theonesandzeros.com',
  'https://theonesandzeros.com',
  'http://172.28.238.244:5173',
  'http://192.168.0.102:5173'
];

const corsOptions = {
  origin: function (origin, callback) {
    console.log("Received origin:", origin); // Debugging

    const normalizedOrigin = origin?.replace(/:80$/, ''); // Normalize origin

    if (!origin || allowedOrigins.includes(normalizedOrigin)) {
      console.log("Origin is allowed:", origin); // Debugging
      callback(null, true);
    } else {
      console.log("Origin is not allowed:", origin); // Debugging
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['*'], // Allow all HTTP methods
  allowedHeaders: ['*'], // Allow all headers
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

app.use('/api/images', express.static('media/thumbnails'));

app.get('/api/bloglist', async (req, res) => {
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

app.post('/api/data', async (req, res) => {
  console.log('Received request body:', req.body);
  const { integerValue } = req.body;
  console.log('Received integerValue:', integerValue);

  // Validate the integerValue
  if (!integerValue || !Number.isInteger(integerValue)) {
    return res.status(400).json({ error: 'Invalid integer value' });
  }

  try {
    const data = await db.query('SELECT * FROM Post WHERE postid = $1;', [integerValue]);

    // Check if data exists
    if (data.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json(data.rows);

  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'An error occurred while fetching data from the database.',
      details: err.message
    });
  }
});

app.listen(PORT, HOST, () => console.log(`Listening on http://${HOST}:${PORT}/`));
