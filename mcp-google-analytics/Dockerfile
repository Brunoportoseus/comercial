FROM node:22-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY src ./src
ENV NODE_ENV=production PORT=8080 GOOGLE_APPLICATION_CREDENTIALS=/credentials/service-account.json
USER node
EXPOSE 8080
CMD ["node", "src/server.js"]
