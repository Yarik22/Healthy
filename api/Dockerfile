# Stage 1: Build the NestJS app
FROM node:22-alpine as build

WORKDIR /usr/src/app

COPY ./api/package*.json ./
RUN npm install

COPY ./api . 
RUN npm run build

# Stage 2: Run the app
FROM node:22-alpine

WORKDIR /usr/src/app

# Only copy what's needed for production
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY ./api/package*.json ./

# Expose fixed port (ENV vars don't work with EXPOSE)
EXPOSE ${API_PORT:-3000}

# Run the app (targeting dist/src/main.js)
CMD ["node", "dist/src/main.js"]
