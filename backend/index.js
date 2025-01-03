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
  'http://172.28.238.244:5173'
];

const corsOptions = {
  origin: function (origin, callback) {

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

app.use('/api/files', express.static('webfiles'));

app.get('/api/bloglist', async (req, res) => {
  const searchQuery = req.query.query || "";

  try {
    const limit = 12;
    const query = `
      SELECT postid, title, author, publicationdate, slug, content 
      FROM Post 
      ${searchQuery ? 'WHERE title ILIKE $1' : ''} 
      ORDER BY postid ASC
      LIMIT $${searchQuery ? 2 : 1}`;
    const values = searchQuery ? [`%${searchQuery}%`, limit] : [limit];
    const data = await db.query(query, values);

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
  const { slug } = req.body;
  console.log(slug);

  try {
    const data = await db.query('SELECT * FROM Post WHERE slug = $1;', [slug]);

    // Check if data exists
    if (data.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const post = data.rows[0];

    // Check if map-related data exists
    const { mapcenter, zoom } = post;

    const mapDetails = mapcenter ? {
      center: mapcenter.split(','),  // Example: Convert a string like '12.34,-56.78' into an array [12.34, -56.78]
      zoom: zoom || 2  // Default zoom level if not available
    } : null;

    // Send the post data along with map details
    res.json({
      post: post,
      mapDetails: mapDetails
    });

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