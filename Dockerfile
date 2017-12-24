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

#FROM node:6.9.5-alpine
#
#  RUN mkdir -p /var/app1
#  WORKDIR /var/app
#  COPY ./ /var/app
#
#  RUN npm install --production
#
#  ENV NODE_ENV=production NODE_PATH=./lib:.
#  EXPOSE 3000
#
#  CMD ["node", "web/bin/www"]
