FROM node:10.22.0-alpine3.10

RUN apk add --no-cache bash
WORKDIR /usr/src/moviez-rate-api
RUN npm install
COPY ./ ./
EXPOSE 3001


CMD ["/bin/bash"]