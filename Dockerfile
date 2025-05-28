FROM node:20-alpine

WORKDIR /app

# Define build arguments for environment variables
ARG VITE_API_URL
ARG VITE_APP_ENV
ARG PORT
ARG VITE_INTERCOM_APP_ID
# Add other environment variables as needed

# Set environment variables
ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_APP_ENV=${VITE_APP_ENV}
ENV VITE_INTERCOM_APP_ID=${VITE_INTERCOM_APP_ID}
ENV PORT=${PORT:-8085}
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

# Expose the port
EXPOSE ${PORT}

# Start the Vite preview server
CMD ["sh", "-c", "npm run preview -- --host 0.0.0.0 --port $PORT"]