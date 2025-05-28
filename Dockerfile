FROM node:20-alpine AS build

WORKDIR /app

# Define build arguments for environment variables
ARG VITE_API_URL
ARG VITE_APP_ENV
ARG PORT
ARG VITE_INTERCOM_APP_ID
# Add other environment variables as needed

# Set environment variables for build
ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_APP_ENV=${VITE_APP_ENV}
ENV VITE_INTERCOM_APP_ID=${VITE_INTERCOM_APP_ID}
ENV PORT=${PORT}
# Set other environment variables as needed

# Copy package.json and lockfile
COPY package*.json ./
COPY bun.lockb ./

# Install dependencies with legacy peer deps flag to resolve dependency issues
RUN npm ci --legacy-peer-deps

# Copy project files
COPY . .

# Build the app with environment variables
RUN npm run build

# Production image
FROM nginx:alpine

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Create a custom nginx config for SPA routing that uses the PORT variable
RUN echo 'server { \
    listen ${PORT}; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf.template

# Use the PORT environment variable
ENV PORT=${PORT:-8085}

# Expose the port
EXPOSE ${PORT}

# Setup entrypoint script to substitute environment variables
COPY docker-entrypoint.sh /
RUN chmod +x /docker-entrypoint.sh

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]