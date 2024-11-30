const express = require("express");
const db = require('./db');
const cors = require('cors');
const bodyParser = require('body-parser');
const PORT = 3000;
const HOST = '0.0.0.0';

const app = express();

// Configure CORS for specific domains
const corsOptions = {
  origin: function (origin, callback) {
    console.log("Received origin:", origin); // Log the origin for debugging

    // List of allowed domains
    const allowedOrigins = ['http://144.126.254.165:80', 'http://172.28.238.244:5173'];

    // If origin is in the allowed list or if there's no origin (for non-browser requests like curl or Postman)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      console.log("Origin is allowed:", origin); // Log allowed origin for debugging
      callback(null, true);
    } else {
      console.log("Origin is not allowed:", origin); // Log rejected origin for debugging
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['*'], // Allow all HTTP methods
  allowedHeaders: ['*'], // Allow all headers
};

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
