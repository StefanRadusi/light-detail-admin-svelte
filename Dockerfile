FROM oven/bun:1
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends curl && rm -rf /var/lib/apt/lists/*
COPY . .
RUN bun install
RUN bun run build
EXPOSE 3000
ENV HOST=0.0.0.0
ENV PORT=3000
ENV PUBLIC_API_BASE_URL=https://whatever-your-api-is.com
CMD ["bun", "build/index.js"]