FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci

# Copy source files
COPY . .

# Generate Prisma client and push DB schema
RUN npx prisma generate

# Build the application
RUN npm run build

# Expose port
EXPOSE 3000

ENV NODE_ENV=production
ENV DATABASE_URL="file:./prisma/dev.db"

# Initialize DB and start
CMD npx prisma db push && npm start
