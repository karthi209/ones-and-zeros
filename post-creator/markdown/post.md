---
title: "How to Use JWT Tokens for Authentication"
author: "John Doe"
category: "Authentication"
publicationdate: "2025-01-01"
tags: ["JWT", "Security", "Authentication"]
postid: 104a774e-b8cf-4af1-b297-d98b99a12b7b
hasMap: true
mapCenter: [37.7749, -122.4194]
zoom: 10
gisDataUrl: "https://theonesandzeros.com/api/files/gis/expanded-gcc.geojson"
image: "example-image.jpg"
---

## Introduction

JWT (JSON Web Tokens) are an open standard for securely transmitting information between parties. In this article, we'll learn how JWT tokens are used for authentication.

## How JWT Works

JWT consists of three parts:
1. **Header**: Contains information about the algorithm used to sign the token.
2. **Payload**: Contains the claims (e.g., user information).
3. **Signature**: Used to verify the authenticity of the token.

## Example Code

```javascript
const jwt = require('jsonwebtoken');

const token = jwt.sign({ userId: 123 }, 'your-secret-key', { expiresIn: '1h' });
console.log(token);

```
[MAP]

### Explanation

- **Front Matter**: 
  - The metadata at the top (between the `---`) defines the post's title, author, category, publication date, tags, and other information like `postid`, `hasMap`, etc.
  
- **Content**: 
  - The content below the front matter is your blog content. You can include any Markdown-supported content here, such as headings, paragraphs, lists, and code blocks.
  
- **Map**: 
  - The `[MAP]` tag is used to indicate that the post has a map. The `hasMap` flag in the front matter (`true`) enables map display, and the `mapCenter` and `zoom` values will be used to configure the map when rendering the post.

- **Image**: 
  - The `image` field points to a file, like `"example-image.jpg"`, that you can process using the script (make sure to have the image in the correct directory or handle its path).

---

### Testing the Script

1. **Place this `.md` file** in the `markdown/` directory of your project.
2. **Ensure that the image** (`example-image.jpg`) is available in your image folder or handle it accordingly.
3. **Run the script**:
   ```bash
   node scripts/createPost.js

