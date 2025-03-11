FROM node

WORKDIR /app

COPY package*.json ./

RUN npm install

EXPOSE 6050

COPY . .

CMD ["npm", "start"]