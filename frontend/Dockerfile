# Stage 1: Build stage
FROM node:latest AS build-stage

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "run", "build"]

# Stage 2: Production stage
FROM nginx:latest

RUN apt-get update && \
    apt-get install -y certbot python3-certbot-nginx && \
    apt-get clean

COPY nginx.conf /etc/nginx/nginx.conf

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

COPY --from=build-stage /app/dist .

EXPOSE 80 443

# RUN certbot --nginx --agree-tos --no-eff-email -d devpipe.ee

CMD ["nginx", "-g", "daemon off;"]