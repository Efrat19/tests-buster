FROM node:lts-alpine as dist-builder

RUN npm i -g tests-buster
