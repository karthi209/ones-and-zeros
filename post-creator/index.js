const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const db = require('./db');
const { v4: uuidv4 } = require('uuid');

// Function to generate a slug based on the title
function generateSlug(title) {
  return title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
}

async function upsertPost(title, content, author, category, publicationdate, tags, hasmap, postId = null) {
  const slug = generateSlug(title);  // Generate a slug for the post

  // Check if postId is provided (update) or not (insert new post)
  const query = postId
    ? `
        UPDATE Post 
        SET 
          title = $2,
          content = $3,
          author = $4,
          category = $5,
          publicationdate = $6,
          tags = $7,
          slug = $8,
          hasmap = $9
        WHERE postid = $1
        RETURNING *;
      `
    : `
        INSERT INTO Post (postid, title, content, author, category, publicationdate, tags, slug, hasmap )
        VALUES ( $1, $2, $3, $4, $5, $6, $7, $8, $9 )
        RETURNING *;
      `;

  const values = postId
    ? [postId, title, content, author, category, publicationdate, tags, slug, hasmap]
    : [uuidv4(), title, content, author, category, publicationdate, tags, slug, hasmap];

  try {
    const res = await db.query(query, values);
    if (res.rows.length > 0) {
      console.log(`Post ${postId ? 'updated' : 'inserted'}: ${res.rows[0].title}`);
    }
  } catch (err) {
    console.error('Error updating/inserting post:', err);
  }
}

async function processMarkdownFiles() {
  const dirPath = path.join(__dirname, 'markdown');

  try {
    const files = await fs.promises.readdir(dirPath);

    for (const file of files) {
      if (path.extname(file) === '.md') {
        const filePath = path.join(dirPath, file);
        const markdown = fs.readFileSync(filePath, 'utf8');

        // Parse markdown file
        const { data, content } = matter(markdown);

        // Extract front matter fields
        const { title, author, category, publicationdate, tags, hasmap } = data;

        // Log the extracted values
        console.log('Extracted data:', { title, hasmap });

        // Ensure required fields are available
        if (title && author && content && category && publicationdate && tags) {
          const slug = generateSlug(title);
          const existingPost = await db.query('SELECT * FROM Post WHERE slug = $1', [slug]);

          if (existingPost.rows.length > 0) {
            // If post exists, update it
            await upsertPost(title, content, author, category, publicationdate, tags, hasmap, existingPost.rows[0].postid);
          } else {
            // If post doesn't exist, create a new one
            await upsertPost(title, content, author, category, publicationdate, tags, hasmap);
          }
        } else {
          console.error(`Missing required fields in ${filePath}`);
        }
      }
    }

    console.log('All posts processed.');
  } catch (err) {
    console.error('Error reading markdown files:', err);
  } finally {
    db.end();
  }
}

processMarkdownFiles();
