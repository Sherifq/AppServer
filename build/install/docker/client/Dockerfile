FROM ubuntu:18.04 AS builder

ARG RELEASE_DATE="2016-06-21"
ARG RELEASE_DATE_SIGN=""
ARG VERSION="8.9.0.190"
ARG SOURCE_REPO_URL="deb http://static.teamlab.com.s3.amazonaws.com/repo/debian squeeze main"
ARG DEBIAN_FRONTEND=noninteractive

ARG APPS_UID="107"
ARG APPS_GID="104"

LABEL onlyoffice.community.release-date="${RELEASE_DATE}" \
      onlyoffice.community.version="${VERSION}" \
      maintainer="Ascensio System SIA <support@onlyoffice.com>"

ENV LANG=en_US.UTF-8 \
    LANGUAGE=en_US:en \
    LC_ALL=en_US.UTF-8

#RUN set -x ; \
#    addgroup -g ${APPS_GID} -S onlyoffice ; \
#    adduser -u ${APPS_UID} -D -S -G onlyoffice onlyoffice

COPY . /app/onlyoffice/src/

RUN apt-get update -y && \
    apt-get install gnupg2 apt-transport-https ca-certificates sudo locales software-properties-common wget curl cron rsyslog -yq && \
    locale-gen en_US.UTF-8 && \
    curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash - && \
    curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add - && \
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list && \
    wget http://nginx.org/keys/nginx_signing.key && \
    apt-key add nginx_signing.key && \
    echo "deb http://nginx.org/packages/mainline/ubuntu/ bionic nginx" >> /etc/apt/sources.list.d/nginx.list && \
    echo "deb-src http://nginx.org/packages/mainline/ubuntu/ bionic nginx" >> /etc/apt/sources.list.d/nginx.list && \
    apt-get update -y && \
    cd ~ && \
    echo "#!/bin/sh\nexit 0" > /usr/sbin/policy-rc.d && \
    apt-get install -yq libgdiplus \
                        nodejs \
                        nginx \
                        jq \
                        yarn \
                        supervisor && \
    cd /app/onlyoffice/src/ && \
    yarn install --cwd web/ASC.Web.Components --frozen-lockfile > build/ASC.Web.Components.log && \
    npm run build --prefix web/ASC.Web.Components && \
    yarn pack --cwd web/ASC.Web.Components && \
    component=$(ls web/ASC.Web.Components/asc-web-components-v1.*.tgz) && \
	yarn remove asc-web-components --cwd web/ASC.Web.Common --peer && \
    yarn add file:../../$component --cwd web/ASC.Web.Common --cache-folder ../../yarn --peer && \
    yarn install --cwd web/ASC.Web.Common --frozen-lockfile > build/ASC.Web.Common.log && \
    npm run build --prefix web/ASC.Web.Common && \
    yarn pack --cwd web/ASC.Web.Common && \
    component=$(ls web/ASC.Web.Components/asc-web-components-v1.*.tgz) && \
	common=$(ls web/ASC.Web.Common/asc-web-common-v1.*.tgz) && \
	yarn remove asc-web-components asc-web-common --cwd web/ASC.Web.Client && \
    yarn add ../../$component --cwd web/ASC.Web.Client --cache-folder ../../yarn && \
	yarn add ../../$common --cwd web/ASC.Web.Client --cache-folder ../../yarn && \
    yarn install --cwd web/ASC.Web.Client --frozen-lockfile || (cd web/ASC.Web.Client && npm i && cd ../../) && \
    npm run build --prefix web/ASC.Web.Client && \
    rm -rf /var/www/studio/client/* && \
    mkdir -p /var/www/studio/client && \
    cp -rf web/ASC.Web.Client/build/* /var/www/studio/client && \
    yarn cache clean && \
    rm -f /etc/nginx/conf.d/* && \
    cp -rf build/install/docker/client/onlyoffice-studio.conf /etc/nginx/conf.d/ && \
    mkdir -p /app/onlyoffice/config/ && cp -rf config/* /app/onlyoffice/config/ && \
    cp build/install/docker/client/docker-entrypoint.sh / && \
    cp build/install/docker/client/supervisord.conf /etc/supervisor/conf.d/supervisord.conf && \
    rm -rf /app/onlyoffice/src && \
    rm -rf /var/lib/apt/lists/

EXPOSE 5001

ENTRYPOINT ["bash", "-c", "/docker-entrypoint.sh"]

