FROM node:22-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

FROM base AS builder
ARG GIT_SHA=unknown
ENV PUBLIC_GIT_SHA=$GIT_SHA
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM base AS runner
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=4321

COPY --from=builder /app/dist ./dist
COPY --from=deps /app/node_modules ./node_modules

RUN mkdir -p /data

VOLUME ["/data"]

EXPOSE 4321

CMD ["node", "dist/server/entry.mjs"]
