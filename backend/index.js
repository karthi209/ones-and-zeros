const express = require("express");
const db = require('./db');
const cors = require('cors');
const bodyParser = require('body-parser');
const PORT = 3000;
const HOST = '0.0.0.0';

const app = express();

// CORS configuration remains the same
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
    const normalizedOrigin = origin?.replace(/:80$/, '');
    if (!origin || allowedOrigins.includes(normalizedOrigin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

app.use('/api/files', express.static('webfiles'));

// Fixed bloglist endpoint to ensure array response
app.get('/api/bloglist', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  const searchQuery = req.query.query || "";

  try {
    // Get total count of posts
    const countQuery = searchQuery 
      ? 'SELECT COUNT(*) FROM Post WHERE title ILIKE $1'
      : 'SELECT COUNT(*) FROM Post';
    const countValues = searchQuery ? [`%${searchQuery}%`] : [];
    const totalResult = await db.query(countQuery, countValues);
    const total = parseInt(totalResult.rows[0].count);

    // Get paginated posts
    const query = `
      SELECT postid, title, author, publicationdate, slug, content 
      FROM Post 
      ${searchQuery ? 'WHERE title ILIKE $1' : ''} 
      ORDER BY publicationdate DESC
      LIMIT $${searchQuery ? 2 : 1} 
      OFFSET $${searchQuery ? 3 : 2}
    `;
    
    const values = searchQuery 
      ? [`%${searchQuery}%`, limit, offset]
      : [limit, offset];

    const result = await db.query(query, values);

    res.json({
      posts: result.rows,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalPosts: total
    });

  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'An error occurred while processing your request.'
    });
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

// Individual post endpoint
app.get('/api/blog/:slug', async (req, res) => {
  const { slug } = req.params;

  try {
    const result = await db.query('SELECT * FROM Post WHERE slug = $1;', [slug]);

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        error: 'Post not found',
        message: `No post found with slug: ${slug}`
      });
    }

    const post = result.rows[0];
    
    // Transform the post data
    const response = {
      ...post,
      publicationdate: new Date(post.publicationdate).toISOString(),
      mapDetails: post.mapcenter ? {
        center: post.mapcenter.split(',').map(coord => parseFloat(coord)),
        zoom: parseInt(post.zoom) || 2
      } : null
    };

    res.json(response);

  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'An error occurred while fetching data from the database.'
    });
  }
});

app.listen(PORT, HOST, () => console.log(`Server running on http://${HOST}:${PORT}/`));