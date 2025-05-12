# Stage 1: Build the Angular app
FROM node:22-alpine as build

WORKDIR /usr/src/app

COPY ./client/package*.json ./
RUN npm install

COPY ./client .
RUN npm run build

# Stage 2: Serve with NGINX
FROM nginx:alpine

# Copy the Angular build files to NGINX's web directory
COPY --from=build /usr/src/app/dist/client/browser /usr/share/nginx/html

# Copy a default NGINX config (optional: can use your own)
COPY ./client/nginx.conf /etc/nginx/conf.d/default.conf

# Expose Angular port (default 4200)
EXPOSE ${CLIENT_PORT:-4200}

CMD ["nginx", "-g", "daemon off;"]
