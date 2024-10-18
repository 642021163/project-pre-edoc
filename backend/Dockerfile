FROM node:20.5.0



WORKDIR /app

COPY ["package.json", "package-lock.json", "./"]
RUN ls
RUN npm install
COPY . .

EXPOSE 3000

CMD ["node", "server.js"]