FROM node:22-alpine as build
WORKDIR /usr/src/app
COPY ./api/package*.json ./
RUN npm install
COPY ./api . 
RUN npm run build
FROM node:22-alpine
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY ./api/package*.json ./
EXPOSE ${API_PORT:-3000}
CMD ["node", "dist/src/main.js"]
