FROM node:0.12.2
RUN mkdir -p /usr/src/app
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN ["make"]
WORKDIR build
CMD ["npm", "start"]
EXPOSE 8080
