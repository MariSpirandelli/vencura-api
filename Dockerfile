FROM node:18.12.0

RUN mkdir -p /home/node/app/ && mkdir -p /home/node/app/node_modules/

WORKDIR /home/node/app/

COPY package.json ./
COPY yarn.lock ./

# Install yarn
RUN npm install yarn

RUN rm package-lock.json

# Install dependencies
RUN yarn install

COPY . ./

CMD [ "yarn", "dev" ]
