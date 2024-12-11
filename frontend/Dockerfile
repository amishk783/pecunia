FROM node:20-alpine3.18

RUN addgroup app && adduser -S app -G app 

USER app

RUN mkdir -p /home/app/frontend

WORKDIR /home/app/frontend

COPY --chown=app:app package*.json ./

RUN npm install --force

COPY --chown=app:app . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]
