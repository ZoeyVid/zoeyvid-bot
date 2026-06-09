# syntax=docker/dockerfile:1.24.0@sha256:87999aa3d42bdc6bea60565083ee17e86d1f3339802f543c0d03998580f9cb89
FROM alpine:3.24.0@sha256:660e0827bd401543d81323d4886abbd08fda0fe3ba84337837d0b11a67251283
SHELL ["/bin/ash", "-eo", "pipefail", "-c"]
ENV NODE_ENV=production
COPY . /app
WORKDIR /app
RUN apk upgrade --no-cache -a && \
    apk add --no-cache tzdata tini nodejs jq pnpm binutils file && \
    pnpm install --frozen-lockfile --prod && \
    pnpm cache delete && \
    find node_modules -name "*.map" -delete && \
    find /app/node_modules -name "*.node" -type f -exec strip -s {} \; && \
    find /app/node_modules -name "*.node" -type f -exec file {} \; && \
    apk del --no-cache pnpm binutils file

ENTRYPOINT ["tini", "--", "node", "/app/main.js"]
HEALTHCHECK CMD [ "$(wget -q -O - http://127.0.0.1:2020)" = "$(cat /app/config.json | jq -r .status_message)" ] || exit 1
