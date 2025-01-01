---
postid: 1
title: "Chennai Transit Map"
author: "Karthikeyan Manimaran"
category: Transit
publicationdate: "2025-12-01 00:40:00"
tags: transit, maps, chennai
---

# Running Python Web Applications on WSL2 and Accessing Externally

Developing web applications with Python in WSL2 can boost productivity with Linux-based tools, but accessing these applications externally requires some configuration.

### Step 1: Start Your Python App

Run your Python web app, such as a Flask app:

```shell
flask run --host=0.0.0.0 --port=5000
