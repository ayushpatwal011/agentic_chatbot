FROM node

# Set working directory to /app
WORKDIR /app

# Copy root package files
COPY package*.json ./

# Install root dependencies (concurrently, ioredis)
RUN npm install

# Copy sub-services package files to install their dependencies
COPY gateway/package*.json ./gateway/
COPY services/auth/package*.json ./services/auth/
COPY services/chat/package*.json ./services/chat/
COPY services/agent/package*.json ./services/agent/

# Install dependencies for all microservices
RUN npm install --prefix gateway
RUN npm install --prefix services/auth
RUN npm install --prefix services/chat
RUN npm install --prefix services/agent

# Copy all files from the backend directory to the container
COPY . .

# Expose API Gateway port
EXPOSE 8000

# Start all microservices concurrently
CMD ["npm", "start"]
