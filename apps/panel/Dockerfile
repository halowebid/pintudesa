FROM oven/bun:1 AS builder
# Set working directory
WORKDIR /app
COPY . .
RUN bun install --global turbo
RUN bun turbo prune --scope=@pintudesa/panel --docker

# Add lockfile and package.json's of isolated subworkspace
FROM oven/bun:1 AS installer
WORKDIR /app
RUN bun install --global turbo

# First install the dependencies (as they change less often)
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/bun.lock ./bun.lock

RUN bun install

# Build the project
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json

RUN bun turbo run build --filter=@pintudesa/panel...

FROM oven/bun:1 AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Don't run production as root
RUN addgroup --system --gid 1001 pintudesa-panel
RUN adduser --system --uid 1001 pintudesa-panel
USER pintudesa-panel

COPY --from=installer /app .
COPY --from=installer --chown=pintudesa-panel:pintudesa-panel /app ./

CMD cd apps/panel && bun run start
