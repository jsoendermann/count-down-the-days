FROM node:14.5.0-alpine3.11

WORKDIR /workspace

COPY package.json .
COPY package-lock.json .
RUN npm ci

COPY . .

EXPOSE 9980

CMD ["npm", "run", "start"]