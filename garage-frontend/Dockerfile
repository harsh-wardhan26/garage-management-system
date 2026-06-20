# Stage 1: Build compilation stage
FROM node:20-alpine AS build

WORKDIR /app

# Copy dependency definition manifest files
COPY package*.json ./

# Install packages
RUN npm install

# Copy frontend source files
COPY . .

# Compile TS and build production bundle assets
RUN npm run build

# Stage 2: Production web server container stage
FROM nginx:alpine

# Copy built SPA static pages from compilation stage
COPY --from=build /app/dist /usr/share/nginx/html

# Replace default Nginx configuration with proxy setup
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose web port
EXPOSE 80

# Launch Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
