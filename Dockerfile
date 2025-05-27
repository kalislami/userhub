# Build Stage
FROM node:20 AS builder

WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Production Stage
FROM node:20

WORKDIR /app
COPY --from=builder /app .

# Install production deps only
RUN npm install --omit=dev

# Port yang akan dibuka (Next.js default: 3000, Express: 3001)
EXPOSE 3000
EXPOSE 3001

# Jalankan frontend dan backend secara bersamaan
CMD ["npm", "start"]
