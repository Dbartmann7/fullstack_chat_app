# syntax=docker/dockerfile:1

FROM dhi.io/node:24-alpine3.23-dev AS builder
WORKDIR /app

# Install all dependencies, including TypeScript for the build.
COPY Backend/package.json Backend/package-lock.json ./Backend/
RUN --mount=type=cache,target=/root/.npm \
    npm ci --prefix Backend

# The tsconfig includes the sibling shared directory.
COPY Backend/ ./Backend/
COPY shared/ ./shared/
RUN npm run build --prefix Backend


FROM dhi.io/node:24-alpine3.23-dev AS deps
WORKDIR /app

COPY Backend/package.json Backend/package-lock.json ./Backend/
RUN --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev --prefix Backend


FROM dhi.io/node:24-alpine3.23 AS runner
ENV NODE_ENV=production
WORKDIR /app

COPY --from=deps --chown=node:node /app/Backend/node_modules ./Backend/node_modules
COPY --from=builder --chown=node:node /app/Backend/build ./Backend/build

EXPOSE 3000
CMD ["node", "Backend/build/Backend/src/server.js"]