FROM node:12.18-alpine as debug

WORKDIR /usr/src/app
RUN apk add --update git
COPY package.json .
RUN npm install
RUN npm install -g nodemon
COPY . .
ENTRYPOINT [ "nodemon", "-r", "esm", "--inspect-brk=0.0.0.0", "server.js" ]

# -----------------------------------------------------------------------------
FROM node:12.18-alpine as prod

WORKDIR /usr/src/app
COPY package.json .
RUN apk add --no-cache --update git && npm i --only=production
COPY . .
ENV NODE_ENV=production
EXPOSE 3000
CMD [ "npm", "start" ]