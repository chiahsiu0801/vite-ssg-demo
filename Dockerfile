# Use a Node.js base image with Alpine to keep it lightweight
FROM node:18-alpine

# Install nginx and tzdata (for timezone support)
RUN apk add --no-cache nginx tzdata

# Set the timezone to UTC+8 (Asia/Shanghai, Asia/Singapore, Asia/Hong_Kong, etc.)
ENV TZ=Asia/Taipei
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Create app directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source files
COPY . .

# Build the SSG and CSR versions
RUN npm run build:csr
RUN npm run build:ssg

# Create nginx directories
RUN mkdir -p /usr/share/nginx/html/dist-csr
RUN mkdir -p /usr/share/nginx/html/dist-ssg

# Copy the SSG files directly
RUN cp -r dist-ssg/* /usr/share/nginx/html/dist-ssg/

# Fix the nested directory issue for CSR
# If the structure is dist-csr/dist-csr/assets, we need to flatten it
RUN if [ -d "dist-csr/dist-csr" ]; then \
        cp -r dist-csr/dist-csr/* /usr/share/nginx/html/dist-csr/; \
    else \
        cp -r dist-csr/* /usr/share/nginx/html/dist-csr/; \
    fi

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Remove default nginx configuration
RUN rm -rf /etc/nginx/conf.d/*

# Create a startup script
RUN echo '#!/bin/sh' > /start.sh && \
    echo 'nginx' >> /start.sh && \
    echo 'node server.js' >> /start.sh && \
    chmod +x /start.sh

# Expose port 80
EXPOSE 80

# Start both nginx and the Node.js server
CMD ["/start.sh"] 