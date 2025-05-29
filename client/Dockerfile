FROM node:22-alpine as build
WORKDIR /usr/src/app
COPY ./client/package*.json ./
RUN npm install
COPY ./client .
RUN npm run build
FROM nginx:alpine
COPY --from=build /usr/src/app/dist/client/browser /usr/share/nginx/html
COPY ./client/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE ${CLIENT_PORT:-4200}
CMD ["nginx", "-g", "daemon off;"]
