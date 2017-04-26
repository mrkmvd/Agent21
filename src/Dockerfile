
FROM node:5.4

# Install app dependencies.
COPY package.json /src/package.json
WORKDIR /src
RUN npm install

# Bundle app source.
COPY agent21.js /src

CMD ["node", "/src/agent21.js"]
