FROM node:19-alpine

EXPOSE 8000
ENV NODE_ENV=production

WORKDIR /dist

# Copy package.json and install packages
COPY package*.json ./
RUN npm i

# Build application
COPY ./src ./src

ENTRYPOINT ["node"]
CMD [ "src/index.js" ]
