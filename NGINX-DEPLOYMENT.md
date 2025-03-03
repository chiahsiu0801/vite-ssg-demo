# Nginx Deployment for SSG/CSR Hybrid Routing

This setup allows you to serve your application with Nginx using a hybrid approach:
- The root route (`/`) is served from the Static Site Generation (SSG) build
- All other routes are served from the Client-Side Rendering (CSR) build

## Prerequisites

- Docker installed on your system
- Your application built with both SSG and CSR outputs in the `dist-ssg` and `dist-csr` directories

## Files

- `nginx.conf`: The Nginx configuration that handles the routing logic
- `Dockerfile`: Builds a Docker image with Nginx and your application
- `deploy.sh`: A helper script to build and run the Docker container

## How It Works

The Nginx configuration uses location blocks to route requests:
- `location = /` matches exactly the root path and serves content from `dist-ssg`
- `location /` matches all other paths and serves content from `dist-csr`

## Deployment

1. Make sure you have built your application with both SSG and CSR outputs:
   - `dist-ssg/` should contain your SSG build
   - `dist-csr/` should contain your CSR build

2. Run the deployment script:
   ```bash
   ./deploy.sh
   ```

3. Access your application:
   - Root route (SSG): http://localhost:8080/
   - Other routes (CSR): http://localhost:8080/any-other-path

## Manual Deployment

If you prefer to run the commands manually:

```bash
# Build the Docker image
docker build -t nginx-test .

# Run the container
docker run -d -p 8080:80 --name nginx-test nginx-test
```

## Customization

- To change the port, modify the `-p` flag in the `docker run` command (e.g., `-p 3000:80` to use port 3000)
- To modify the routing logic, edit the `nginx.conf` file

## Troubleshooting

If you encounter issues:

1. Check the Nginx logs:
   ```bash
   docker exec nginx-test cat /var/log/nginx/error.log
   ```

2. Verify your container is running:
   ```bash
   docker ps | grep nginx-test
   ```

3. Restart the container:
   ```bash
   docker restart nginx-test
   ``` 