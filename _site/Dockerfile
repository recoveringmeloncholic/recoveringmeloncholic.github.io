# Use official Ruby image
FROM ruby:3.1-alpine

# Install dependencies
RUN apk add --no-cache \
    build-base \
    gcc \
    cmake \
    git \
    nodejs \
    npm

# Install Jekyll and Bundler
RUN gem install jekyll bundler

# Set working directory
WORKDIR /srv/jekyll

# Copy Gemfile
COPY Gemfile* ./

# Install dependencies
RUN bundle install

# Copy the rest of the site
COPY . .

# Expose port 4000 and 35729 (livereload)
EXPOSE 4000 35729

# Run Jekyll server
CMD ["bundle", "exec", "jekyll", "serve", "--host", "0.0.0.0", "--livereload", "--force_polling"]
