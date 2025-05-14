
# Use official Node.js Alpine image (small and efficient)
FROM node:20.16-alpine3.19

# Install dependencies needed for Prisma, bcrypt, and PostgreSQL client
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    openssl \
    postgresql-client

# Set the working directory
WORKDIR /eCommerce

RUN mkdir -p /eCommerce/public/images

RUN chmod -R 777 /eCommerce/public/images

# Copy package.json and package-lock.json first (for layer caching)
COPY package*.json ./

# Copy Prisma folder for generating client before full source code
COPY prisma ./prisma

# Install dependencies (this rebuilds bcrypt for Alpine Linux)
RUN npm install

# Generate Prisma client
RUN npx prisma generate

# Copy the rest of the application code
COPY . .

# Health check (optional)
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD node healthcheck.js || exit 1

# Expose application port
EXPOSE 8845

# Run migrations and start the server
CMD ["sh", "-c", "npx prisma migrate deploy && node prisma/seed.js || true && node server.js"]