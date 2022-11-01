# setup environment with nodejs, copy everything besides node_modules, install dependencies, build, and run
FROM node:18.12
WORKDIR /tests_provider_front
RUN corepack enable