FROM node:14-alpine as building

WORKDIR /app

COPY package.json yarn.lock ./
COPY ./tsconfig*.json ./

RUN yarn install --frozen-lockfile --non-interactive && yarn cache clean

COPY ./src ./src
RUN yarn build

FROM node:14-alpine

WORKDIR /app

COPY --from=building /app/dist ./dist
COPY --from=building /app/node_modules ./node_modules
COPY ./package.json ./

USER node

HEALTHCHECK --interval=60s --timeout=10s --retries=3 \
  CMD sh -c "wget -nv -t1 --spider http://localhost:$PORT/health" || exit 1

CMD ["yarn", "start:prod"]
