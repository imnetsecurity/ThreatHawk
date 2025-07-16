# Dockerfile for ThreatHawk Application

# --- Stage 1: Build Stage ---
FROM node:18-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and lockfile
COPY package*.json ./

# Install all dependencies, including devDependencies for the build step
RUN npm install

# Copy the rest of the application source code
COPY . .

# Set the production environment variables during build
# These can be overridden at runtime.
ARG NEXT_PUBLIC_API_URL="http://localhost:3000"
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

# Build the Next.js application
RUN npm run build


# --- Stage 2: Production/Runner Stage ---
FROM node:18-alpine AS runner

WORKDIR /app

# Set the environment to production
ENV NODE_ENV=production

# Create a non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Copy production dependencies from the builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Copy the built Next.js application
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Change the owner of the copied files to the non-root user
RUN chown -R nextjs:nodejs /app

# Switch to the non-root user
USER nextjs

# Expose the port the app runs on
EXPOSE 3000

# The command to start the application
CMD ["npm", "start"]
