# syntax=docker/dockerfile:1.23.0@sha256:2780b5c3bab67f1f76c781860de469442999ed1a0d7992a5efdf2cffc0e3d769
FROM alpine:3.23.4@sha256:5b10f432ef3da1b8d4c7eb6c487f2f5a8f096bc91145e68878dd4a5019afde11
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
