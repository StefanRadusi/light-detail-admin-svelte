FROM oven/bun:1 AS builder
WORKDIR /app
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build

FROM oven/bun:1
WORKDIR /app
COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json ./
RUN bun install --production --frozen-lockfile
EXPOSE 3000
ENV HOST=0.0.0.0
ENV PORT=3000
CMD ["bun", "run", "build/index.js"]