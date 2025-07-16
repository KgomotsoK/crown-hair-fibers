# Build frontend
FROM node:18-alpine AS frontend-builder
WORKDIR /app
COPY fronted/package*.json ./
RUN npm install
COPY fronted/ ./
RUN npm run build

# Build backend
FROM node:18-alpine AS backend-builder
WORKDIR /app
COPY Backend/package*.json ./
RUN npm install
COPY Backend/ ./
RUN npm run build

# Runtime image
FROM node:18-alpine
WORKDIR /app

# Copy frontend build output
COPY --from=frontend-builder /app/.next/standalone ./fronted
COPY --from=frontend-builder /app/.next/static ./fronted/.next/static
COPY --from=frontend-builder /app/public ./fronted/public

# Copy backend build output
COPY --from=backend-builder /app/dist ./Backend

# Install production dependencies for backend
WORKDIR /app/Backend  # Fixed working directory
COPY Backend/package*.json ./
RUN npm install --only=production

# Start backend
EXPOSE 8000 
CMD ["node", "dist/server.js"]  # Fixed path to dist/server.js