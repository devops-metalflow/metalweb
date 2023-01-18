FROM node:latest AS build-stage
RUN mkdir -p /metalweb
COPY . /metalweb
WORKDIR /metalweb
RUN yarn install && \
    yarn run build-prod

FROM pierrezemb/gostatic AS production-stage
WORKDIR /
COPY --from=build-stage /metalweb/dist /srv/http/
