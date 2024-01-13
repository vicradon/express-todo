FROM node:20
WORKDIR /app

COPY . ./
RUN npm ci --only=production

EXPOSE 80

CMD ["node", "app/index.js"]
