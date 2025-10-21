# Recovering Melancholic Blog

A minimalist personal blog built with Jekyll for GitHub Pages, inspired by clean, modern blog design.

## Setup

### Option 1: Docker (Recommended)

1. Make sure you have Docker and Docker Compose installed

2. Run the site:
   ```bash
   docker-compose up
   ```

3. Visit `http://localhost:4000` in your browser

4. The site will auto-reload when you make changes to files

5. To stop the server:
   ```bash
   docker-compose down
   ```

### Option 2: Local Ruby Installation

1. Install dependencies:
   ```bash
   bundle install
   ```

2. Run locally:
   ```bash
   bundle exec jekyll serve
   ```

3. Visit `http://localhost:4000` in your browser

## Structure

- `_posts/` - Blog posts written in Markdown
- `_layouts/` - HTML templates
- `assets/css/` - Stylesheets
- `assets/images/` - Images for posts (you'll need to add your own)

## Writing Posts

Create new posts in the `_posts/` directory with the format: `YYYY-MM-DD-title.md`

Front matter example:
```yaml
---
layout: post
title: "Your Post Title"
date: 2025-10-14 12:00:00 -0000
image: assets/images/your-image.jpg
---
```

## Deploying to GitHub Pages

1. Create a new repository on GitHub
2. Push this code to the repository
3. Go to Settings > Pages
4. Select "Deploy from branch" and choose your main branch
5. Your site will be published at `https://username.github.io/repository-name/`

## Customization

- Edit `_config.yml` to change site title and description
- Modify `assets/css/style.css` to adjust styling
- Update colors by changing CSS variables in `:root`

## License

Free to use and modify for your own projects.
