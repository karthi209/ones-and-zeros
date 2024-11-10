const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const db = require('../shared/db');

// Insert post into the database
async function insertPost(postid, title, content, author, category, publicationdate, tags) {
  const query = `
    INSERT INTO Post (postid, title, content, author, category, publicationdate, tags) 
    VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;
  `;
  const values = [postid, title, content, author, category, publicationdate, tags];

  try {
    const res = await db.query(query, values);
    console.log('Inserted post:', res.rows[0]);
  } catch (err) {
    console.error('Error inserting post:', err);
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
          await insertPost(postid, title, content, author, category, publicationdate, tags);
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