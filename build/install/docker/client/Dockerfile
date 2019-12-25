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
    wget -q https://packages.microsoft.com/config/ubuntu/18.04/packages-microsoft-prod.deb -O packages-microsoft-prod.deb && \
    wget http://nginx.org/keys/nginx_signing.key && \
    apt-key add nginx_signing.key && \
    echo "deb http://nginx.org/packages/mainline/ubuntu/ bionic nginx" >> /etc/apt/sources.list.d/nginx.list && \
    echo "deb-src http://nginx.org/packages/mainline/ubuntu/ bionic nginx" >> /etc/apt/sources.list.d/nginx.list && \
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
    cp build/install/docker/client/supervisord.conf /etc/supervisor/conf.d/supervisord.conf && \
    rm -f /etc/nginx/conf.d/* && \
    cp -rf build/install/docker/client/onlyoffice-studio.conf /etc/nginx/conf.d/ && \
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
    dotnet nuget locals all --clear && \
    yarn cache clean && \
    rm -rf /app/onlyoffice/src && \
    rm -rf /var/lib/apt/lists/

EXPOSE 5001

ENTRYPOINT ["/usr/bin/supervisord", "--"]

