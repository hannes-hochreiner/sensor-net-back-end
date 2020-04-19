FROM node:lts-alpine
MAINTAINER Hannes Hochreiner <hannes@hochreiner.net>
COPY src /opt/sensor-net-back-end/src
COPY .babelrc /opt/sensor-net-back-end/.babelrc
COPY package.json /opt/sensor-net-back-end/package.json
RUN cd /opt/sensor-net-back-end && npm install && npm run build
EXPOSE 8080
CMD ["node", "/opt/sensor-net-back-end/bld/index"]
