FROM oven/bun:latest as builder

WORKDIR /app

# Copy package.json and other config files
COPY package.json bun.lock ./
COPY tsconfig.json next.config.ts ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN bun run build

# Production stage
FROM oven/bun:latest

WORKDIR /app

# Copy built app from builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.ts ./next.config.ts
COPY --from=builder /app/stylex.config.cjs ./stylex.config.cjs
COPY --from=builder /app/src ./src
COPY --from=builder /app/indomitus.db ./indomitus.db

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV DB_FILE_NAME=./indomitus.db

# Expose the port the app will run on
EXPOSE 3000

# Start the application
CMD ["bun", "run", "start"]
