FROM node:22-alpine
# Installing libvips-dev for sharp Compatibility
RUN apk update && apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev nasm bash vips-dev git
ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

WORKDIR /opt/
COPY package.json package-lock.json ./
RUN npm install -g node-gyp
RUN npm ci --no-audit --no-fund
RUN sed -i "s/if (oldContentTypes !== undefined && contentTypes !== undefined) {/if (oldContentTypes \\&\\& contentTypes !== undefined) {/" /opt/node_modules/@strapi/content-releases/dist/server/migrations/index.js \
 && sed -i "s/if (oldContentTypes !== undefined && contentTypes !== undefined) {/if (oldContentTypes \\&\\& contentTypes !== undefined) {/" /opt/node_modules/@strapi/content-releases/dist/server/migrations/index.mjs
ENV PATH=/opt/node_modules/.bin:$PATH

WORKDIR /opt/app
COPY . .
RUN chown -R node:node /opt/app
USER node
ARG ADMIN_JWT_SECRET=build-admin-jwt-secret
ARG API_TOKEN_SALT=build-api-token-salt
ARG TRANSFER_TOKEN_SALT=build-transfer-token-salt
ARG ENCRYPTION_KEY=build-encryption-key
ARG APP_KEYS=build-key-a,build-key-b
ENV ADMIN_JWT_SECRET=${ADMIN_JWT_SECRET}
ENV API_TOKEN_SALT=${API_TOKEN_SALT}
ENV TRANSFER_TOKEN_SALT=${TRANSFER_TOKEN_SALT}
ENV ENCRYPTION_KEY=${ENCRYPTION_KEY}
ENV APP_KEYS=${APP_KEYS}
RUN ["npm", "run", "build"]
EXPOSE 1337
CMD ["npm", "run", "develop"]
