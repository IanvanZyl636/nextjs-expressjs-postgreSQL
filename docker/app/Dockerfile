FROM node:lts-slim

WORKDIR /app

COPY ../../package.json package-lock.json ./
COPY ../../apps/backend/package.json ./apps/backend/
COPY ../../libs/shared/package.json ./libs/shared/

RUN npm install --omit=dev

COPY /apps/backend/dist ./apps/backend/dist
COPY /libs/shared/dist ./libs/shared/dist

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node","apps/backend/dist/main.js"]