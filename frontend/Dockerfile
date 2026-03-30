# Stage 1: Build
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Build-time arguments for Vite
ARG VITE_NAKAMA_HOST
ARG VITE_NAKAMA_PORT
ARG VITE_NAKAMA_SSL
ARG VITE_NAKAMA_SERVER_KEY

ENV VITE_NAKAMA_HOST=$VITE_NAKAMA_HOST
ENV VITE_NAKAMA_PORT=$VITE_NAKAMA_PORT
ENV VITE_NAKAMA_SSL=$VITE_NAKAMA_SSL
ENV VITE_NAKAMA_SERVER_KEY=$VITE_NAKAMA_SERVER_KEY

RUN npm run build

# Stage 2: Production Serve
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
# Default Nginx config serves from port 80
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
