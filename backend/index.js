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
  const searchQuery = req.query.query || "";
  const page = parseInt(req.query.page) || 1;
  const limit = 12;
  const offset = (page - 1) * limit;

  try {
    let countQuery;
    let dataQuery;
    let values;

    if (searchQuery) {
      countQuery = `SELECT COUNT(*) FROM Post WHERE title ILIKE $1`;
      dataQuery = `
        SELECT 
          postid, 
          title, 
          author, 
          publicationdate, 
          slug, 
          SUBSTRING(content, 1, 200) || '...' as content
        FROM Post 
        WHERE title ILIKE $1
        ORDER BY publicationdate DESC
        LIMIT $2 OFFSET $3
      `;
      values = [`%${searchQuery}%`, limit, offset];
    } else {
      countQuery = `SELECT COUNT(*) FROM Post`;
      dataQuery = `
        SELECT 
          postid, 
          title, 
          author, 
          publicationdate, 
          slug, 
          SUBSTRING(content, 1, 200) || '...' as content
        FROM Post 
        ORDER BY publicationdate DESC
        LIMIT $1 OFFSET $2
      `;
      values = [limit, offset];
    }

    // Get total count
    const countResult = await db.query(countQuery, searchQuery ? [`%${searchQuery}%`] : []);
    const totalPosts = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalPosts / limit);

    // Get posts
    const result = await db.query(dataQuery, values);
    
    // Transform dates
    const posts = result.rows.map(post => ({
      ...post,
      publicationdate: new Date(post.publicationdate).toISOString()
    }));

    // Send paginated response
    res.json({
      posts,
      totalPosts,
      totalPages,
      currentPage: page
    });

  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'An error occurred while processing your request.',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
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