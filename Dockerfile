FROM node:20

WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

EXPOSE 3000

ENV NEXT_PUBLIC_API_BASE_URL=/api
USER node
CMD ["npm", "start"]
