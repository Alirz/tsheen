FROM node:22-bookworm AS build
WORKDIR /src
COPY apps/react/package.json apps/react/package-lock.json ./
RUN npm ci
COPY apps/react/ ./
RUN npm run build

FROM nginx:1.27-alpine
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY docker/nginx-entrypoint.sh /entrypoint.sh
COPY --from=build /src/dist /usr/share/nginx/html
RUN chmod +x /entrypoint.sh
EXPOSE 3000
ENTRYPOINT ["/entrypoint.sh"]
