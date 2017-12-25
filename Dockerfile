#docker run -v ~/Sites/payment-manager-server:/app -p 3000:3000 pm-backend
FROM node:carbon

# set working directory
RUN mkdir /usr/src/app
WORKDIR /usr/src/app

COPY package*.json ./
# install and cache app dependencies
RUN npm install

ENV PATH /usr/local/lib/node_modules/.bin:$PATH

COPY . .

# start app
CMD npm run backend
EXPOSE 8080
