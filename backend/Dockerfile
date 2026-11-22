FROM node:22-bookworm-slim
ENV NODE_ENV=production
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --no-audit --no-fund
COPY src ./src
COPY --chmod=0755 docker-entrypoint.sh /usr/local/bin/portal-entrypoint
ENTRYPOINT ["portal-entrypoint"]
CMD ["node", "src/index.js"]
