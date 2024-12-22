FROM node:20-alpine3.18 AS build

RUN addgroup app && adduser -S app -G app

USER app

RUN mkdir -p /home/app/frontend

WORKDIR /home/app/frontend

COPY --chown=app:app package*.json ./

RUN npm install --force

COPY --chown=app:app . .

ENV GENERATE_SOURCEMAP=false

RUN NODE_OPTIONS="--max-old-space-size=8192" npm run build

# production environment
FROM nginx:alpine
COPY --from=build /home/app/frontend/dist /usr/share/nginx/html

COPY --from=build /home/app/frontend/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

                              