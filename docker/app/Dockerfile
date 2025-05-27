FROM node:lts-slim

WORKDIR /app

# Copy package.json for prod deps (root and app if needed)
COPY ../../package.json package-lock.json ./
COPY ../../apps/backend/package.json ./apps/backend/
COPY ../../libs/shared/package.json ./libs/shared/

# Install only production dependencies
RUN npm install --omit=dev

# Copy compiled output from builder stage
COPY /apps/backend/dist ./apps/backend/dist
COPY /libs/shared/dist ./libs/shared/dist

# Set environment
ENV NODE_ENV=production

# Optionally expose app port
EXPOSE 3000

# Run compiled Express app
CMD ["node","apps/backend/dist/main.js"]