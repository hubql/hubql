FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./
COPY packages/ui/package.json ./packages/ui/
COPY apps/studio/package.json ./apps/studio/

# Install pnpm
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install

# Copy source files
COPY packages/ui ./packages/ui
COPY apps/studio ./apps/studio

# Build the app
RUN pnpm --filter @hubql/studio build

# Expose the port
EXPOSE 3000

# Start the app
CMD ["pnpm", "--filter", "@hubql/studio", "preview"] 