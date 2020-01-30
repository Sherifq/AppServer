FROM nginx:stable-alpine

RUN apk add --no-cache jq

COPY ./build/install/docker/frontnginx/onlyoffice.conf /etc/nginx/conf.d/onlyoffice.conf
COPY ./build/install/docker/frontnginx/upstream.conf ./build/install/docker/frontnginx/onlyoffice-public.conf /etc/nginx/includes/
COPY ./build/install/docker/frontnginx/docker-entrypoint.sh /

RUN echo "daemon off;" >> /etc/nginx/nginx.conf

EXPOSE 8092

ENTRYPOINT ["sh", "-c", "/docker-entrypoint.sh"]

