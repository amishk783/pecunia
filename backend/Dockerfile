FROM node:20-alpine3.18

RUN addgroup app && adduser -S app -G app

USER app
RUN mkdir /home/app/backend
WORKDIR /app/backend

COPY --chown=app:app package*.json ./

# change ownership of the /app directory to the app user

RUN npm install

COPY --chown=app:app . . 

EXPOSE 5000

CMD npm start
