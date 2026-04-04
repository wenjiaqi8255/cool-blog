FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci --legacy-peer-deps

# Copy source code
COPY . .

# Build
ENV NODE_ENV=production
RUN npm run build

# Expose port (Astro runs on 4321 by default)
EXPOSE 4321
ENV HOSTNAME="0.0.0.0"

# Start the server (Astro standalone mode)
# Use PORT from environment (Zeabur injects WEB_PORT)
CMD ["sh", "-c", "node dist/server/entry.mjs --port ${PORT:-4321}"]