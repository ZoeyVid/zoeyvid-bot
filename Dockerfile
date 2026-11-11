# syntax=docker/dockerfile:1.29.0@sha256:572cebbc2b15e6f84c077742952674889cb63cd5e9b80abdffcbe587b6f19183
FROM alpine:3.24.4@sha256:f59abe656b692d901e184be3445e084786602108599d2a51d229c0f5a48c71bf
SHELL ["/bin/ash", "-eo", "pipefail", "-c"]
ENV NODE_ENV=production
ENV NODE_OPTIONS=--use-openssl-ca
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
