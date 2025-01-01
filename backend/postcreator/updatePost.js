const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const db = require('./db');

// Update post in the database
async function updatePost(postid, title, content, author, category, publicationdate, tags) {
  const query = `
    UPDATE Post
    SET title = $2, content = $3, author = $4, category = $5, publicationdate = $6, tags = $7
    WHERE postid = $1
    RETURNING *;
  `;
  const values = [postid, title, content, author, category, publicationdate, tags];

  try {
    const res = await db.query(query, values);
    if (res.rows.length > 0) {
      console.log('Updated post:', res.rows[0]);
    } else {
      console.log(`Post with postid ${postid} not found, skipping update.`);
    }
  } catch (err) {
    console.error('Error updating post:', err);
  }
}

function processMarkdownFiles() {
  const dirPath = path.join(__dirname, 'markdown');

  fs.readdir(dirPath, async (err, files) => {
    if (err) {
      console.error('Error reading directory:', err);
      return;
    }

    for (const file of files) {
      if (path.extname(file) === '.md') {
        const filePath = path.join(dirPath, file);
        const markdown = fs.readFileSync(filePath, 'utf8');

        // Parse markdown file
        const { data, content } = matter(markdown);

        // Extract front matter fields
        const { postid, title, author, category, publicationdate, tags } = data;

        // Ensure required fields are available
        if (postid && title && author && content && category && publicationdate && tags) {
          await updatePost(postid, title, content, author, category, publicationdate, tags);
        } else {
          console.error(`Missing required fields in ${filePath}`);
        }
      }
    }

    console.log('All posts processed.');
    db.end(); // Close the database connection
  });
}

processMarkdownFiles();