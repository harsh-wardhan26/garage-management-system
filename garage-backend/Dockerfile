FROM node:20-alpine

# Set working directory inside the container
WORKDIR /app

# Copy dependency definition manifest files
COPY package*.json ./

# Install production-only packages
RUN npm install --only=production

# Copy backend source code files into work directory
COPY . .

# Expose backend API default port
EXPOSE 5000

# Run entry point script
CMD ["node", "server.js"]
