FROM nginx:stable-alpine

# Remove default nginx configuration
RUN rm -rf /etc/nginx/conf.d/*

# Create a simple configuration file
RUN echo 'server { \
    listen 80; \
    \
    # Root route (/) - Serve from dist-ssg \
    location = / { \
        alias /usr/share/nginx/html/dist-ssg/; \
        add_header X-Debug-Source "dist-ssg-root" always; \
    } \
    \
    # Assets for SSG \
    location /assets/ { \
        alias /usr/share/nginx/html/dist-ssg/assets/; \
        add_header X-Debug-Source "dist-ssg-assets" always; \
    } \
    \
    # Vite SSG assets \
    location = /vite.svg { \
        alias /usr/share/nginx/html/dist-ssg/vite.svg; \
        add_header X-Debug-Source "dist-ssg-vite-svg" always; \
    } \
    \
    # All other routes - Serve from dist-csr \
    location / { \
        root /usr/share/nginx/html/dist-csr; \
        try_files $uri $uri/ /index.html; \
        add_header X-Debug-Source "dist-csr" always; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Create directories for our content
RUN mkdir -p /usr/share/nginx/html/dist-csr
RUN mkdir -p /usr/share/nginx/html/dist-ssg

# Copy the dist-csr and dist-ssg content
COPY dist-csr/ /usr/share/nginx/html/dist-csr/
COPY dist-ssg/ /usr/share/nginx/html/dist-ssg/

# For debugging - create a test file
RUN echo '<html><body><h1>This is from dist-ssg</h1></body></html>' > /usr/share/nginx/html/dist-ssg/test.html
RUN echo '<html><body><h1>This is from dist-csr</h1></body></html>' > /usr/share/nginx/html/dist-csr/test.html

# Expose port 80
EXPOSE 80 