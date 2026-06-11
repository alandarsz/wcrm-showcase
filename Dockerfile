FROM node:18.14.0-alpine as frontend
WORKDIR /app
COPY package.json .

RUN npm install

COPY . ./

ARG NODE_ENV
RUN if [ "$NODE_ENV" = "development" ]; \
    then npm run build-dev ; \
    else npm run build; \
    fi
ENV TZ="Asia/Jakarta"

FROM nginx:stable-alpine as nginx
COPY --from=frontend /app/dist/ /usr/share/nginx/html/
COPY prod.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;" ]