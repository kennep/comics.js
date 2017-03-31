FROM node:7.8
RUN mkdir -p /usr/src/app
COPY package.json /usr/src/app
WORKDIR /usr/src/app
RUN ["npm", "install"]
COPY . /usr/src/app
RUN ["node_modules/.bin/gulp"]
VOLUME /usr/src/app/data
ENTRYPOINT ["node", "build/dist/server.js"]
EXPOSE 8080
