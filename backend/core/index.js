const express = require("express");
const db = require('../shared/db');
const cors = require('cors');
const bodyParser = require('body-parser');
const port = 3000;

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/images', express.static('media/thumbnails'));

app.get('/bloglist', async (req, res) => {
  try {
    const data = await db.query('SELECT postid, title, author, publicationdate FROM Post ORDER BY postid ASC;');
    res.json(data.rows);

  } catch (err) {
    res.status(500).send(err);
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

app.listen(port, () => console.log(`Listening on ${port}`));
