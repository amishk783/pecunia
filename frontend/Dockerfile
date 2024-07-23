FROM node:20-alpine3.18 as builder

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app
COPY package*.json /usr/src/app
RUN npm install
COPY . /usr/src/app
RUN npm run build
# Stage 2: Create the production image
FROM nginx:latest
COPY --from=builder /usr/src/app /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
RUN chown nginx.nginx /usr/share/nginx/html/ -R

