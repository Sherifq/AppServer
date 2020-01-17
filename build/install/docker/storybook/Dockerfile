FROM ubuntu:18.04

ARG RELEASE_DATE="2016-06-21"
ARG RELEASE_DATE_SIGN=""
ARG VERSION="8.9.0.190"
ARG SOURCE_REPO_URL="deb http://static.teamlab.com.s3.amazonaws.com/repo/debian squeeze main"
ARG DEBIAN_FRONTEND=noninteractive

LABEL onlyoffice.community.release-date="${RELEASE_DATE}" \
      onlyoffice.community.version="${VERSION}" \
      maintainer="Ascensio System SIA <support@onlyoffice.com>"

ENV LANG=en_US.UTF-8 \
    LANGUAGE=en_US:en \
    LC_ALL=en_US.UTF-8

COPY . /app/onlyoffice/src/

RUN apt-get update -y && \
    apt-get install gnupg2 apt-transport-https ca-certificates sudo locales software-properties-common wget curl cron rsyslog -yq && \
    addgroup --system --gid 107 onlyoffice && \
    adduser -uid 104 --quiet --home /var/www/onlyoffice --system --gid 107 onlyoffice && \
    locale-gen en_US.UTF-8 && \
    apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys 3FA7E0328081BFF6A14DA29AA6A19B38D3D831EF && \
    echo "deb https://download.mono-project.com/repo/ubuntu stable-bionic main" | tee /etc/apt/sources.list.d/mono-official.list && \
    curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash - && \
    curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add - && \
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list && \
    wget http://nginx.org/keys/nginx_signing.key && \
    apt-key add nginx_signing.key && \
    echo "deb http://nginx.org/packages/mainline/ubuntu/ bionic nginx" >> /etc/apt/sources.list.d/nginx.list && \
    echo "deb-src http://nginx.org/packages/mainline/ubuntu/ bionic nginx" >> /etc/apt/sources.list.d/nginx.list && \
    wget -q https://packages.microsoft.com/config/ubuntu/18.04/packages-microsoft-prod.deb -O packages-microsoft-prod.deb && \
    dpkg -i packages-microsoft-prod.deb && \
    apt-get update -y && \
    cd ~ && \
    echo "#!/bin/sh\nexit 0" > /usr/sbin/policy-rc.d && \
    apt-get install -yq libgdiplus \
                        nodejs \
                        nginx \
                        vim \
                        ffmpeg \
                        jq \
                        yarn \
                        dotnet-sdk-3.1 \
                        supervisor \
                        mysql-client && \
    cd /app/onlyoffice/src/ && \
    yarn install --cwd web/ASC.Web.Components --frozen-lockfile > build/ASC.Web.Components.log && \
    npm run build --prefix web/ASC.Web.Components && \
    yarn pack --cwd web/ASC.Web.Components && \
    npm run build:storybook --prefix web/ASC.Web.Components && \
    mkdir -p /var/www/story/ && \
    cp -Rf web/ASC.Web.Components/storybook-static/* /var/www/story/ && \
    cp build/install/docker/storybook/supervisord.conf /etc/supervisor/conf.d/supervisord.conf && \
    rm -f /etc/nginx/conf.d/* && \
    cp -rf build/install/docker/storybook/onlyoffice-story.conf /etc/nginx/conf.d/ && \
    mkdir -p /app/onlyoffice/config/ && cp -rf config/* /app/onlyoffice/config/ && \
    cp build/install/docker/storybook/docker-entrypoint.sh / && \
    dotnet nuget locals all --clear && \
    yarn cache clean && \
    rm -rf /app/onlyoffice/src && \
    rm -rf /var/lib/apt/lists/

EXPOSE 8081 8082

ENTRYPOINT ["bash", "-c", "/docker-entrypoint.sh"]
