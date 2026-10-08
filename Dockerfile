# syntax=docker/dockerfile:1.28.0@sha256:bb22d9815c728170f72750f4e5b0d672e06176142e1d602c7e66c050100b7e5b
FROM alpine:3.24.2@sha256:294b683cb724975bec92580e1e685676bd4b50bda910ddb8c51d4cabeaec77e6
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

USER 65534:65534
ENTRYPOINT ["tini", "--", "node", "/app/main.js"]
HEALTHCHECK CMD ["/bin/sh", "-c", "[ \"$(wget -q -O - http://127.0.0.1:\"$(cat /app/config.json | jq -r .status_port)\")\" = \"$(cat /app/config.json | jq -r .status_message)\" ]"]
