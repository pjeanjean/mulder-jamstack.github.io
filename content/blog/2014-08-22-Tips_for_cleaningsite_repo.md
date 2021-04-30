---
layout: blog-post
title: Tips for cleaning my personal website repo
description: Just a tips for cleaning my personal website repo
place: Rennes, France
categories: [website]
published: true
---
Just a tips for cleaning my personal website repo

<!--more-->


```bash
rm -rf .git/
#clean the files that are too big
git init
git add .
git commit -m "Add README.md (initial commit)"
git remote add origin https://github.com/barais/barais.github.io.git
git push origin --mirror
```

I think that I have to test that on [Kevoree](http://www.kevoree.org) repo	 ;)

