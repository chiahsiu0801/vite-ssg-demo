#!/bin/bash

# Build the Docker image
echo "Building Docker image..."
docker build -t nginx-test .

# Check if a container with the same name is already running
if [ "$(docker ps -q -f name=nginx-test)" ]; then
    echo "Stopping existing nginx-test container..."
    docker stop nginx-test
    docker rm nginx-test
fi

# Run the container
echo "Starting nginx-test container..."
docker run -d -p 8080:80 --name nginx-test nginx-test

echo "Deployment complete!"
echo "Your application is now available at:"
echo "- Root route (SSG): http://localhost:8080/"
echo "- Other routes (CSR): http://localhost:8080/any-other-path" 