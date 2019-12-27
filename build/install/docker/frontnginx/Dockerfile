FROM nginx:stable

RUN apt-get update && \
    apt-get install -yq jq \
                        dnsutils \
                        supervisor \
                        curl \
                        vim && \
    rm -rf /var/lib/apt/lists/

COPY ./build/install/docker/frontnginx/onlyoffice.conf /etc/nginx/conf.d/onlyoffice.conf
COPY ./build/install/docker/frontnginx/upstream.conf ./build/install/docker/frontnginx/onlyoffice-public.conf /etc/nginx/includes/
COPY ./build/install/docker/frontnginx/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY ./build/install/docker/frontnginx/docker-entrypoint.sh /

EXPOSE 8092

ENTRYPOINT ["bash", "-c", "/docker-entrypoint.sh"]

