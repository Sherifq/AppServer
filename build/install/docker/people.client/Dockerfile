FROM ubuntu:18.04 AS builder

ARG RELEASE_DATE="2016-06-21"
ARG RELEASE_DATE_SIGN=""
ARG VERSION="8.9.0.190"
ARG SOURCE_REPO_URL="deb http://static.teamlab.com.s3.amazonaws.com/repo/debian squeeze main"
ARG DEBIAN_FRONTEND=noninteractive

ARG APPS_UID="9000"
ARG APPS_GID="9000"

LABEL onlyoffice.community.release-date="${RELEASE_DATE}" \
      onlyoffice.community.version="${VERSION}" \
      maintainer="Ascensio System SIA <support@onlyoffice.com>"

ENV LANG=en_US.UTF-8 \
    LANGUAGE=en_US:en \
    LC_ALL=en_US.UTF-8

#RUN  groupadd -g ${APPS_UID} -r onlyoffice && useradd -u ${APPS_UID} -r -g onlyoffice -m -s /sbin/nologin onlyoffice

#USER onlyoffice

COPY . /app/onlyoffice/src/

RUN apt-get update -y && \
    apt-get install gnupg2 apt-transport-https ca-certificates sudo locales software-properties-common wget curl cron rsyslog -yq && \
    locale-gen en_US.UTF-8 && \
    curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash - && \
    curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add - && \
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list && \
    apt-get update -y && \
    cd ~ && \
    echo "#!/bin/sh\nexit 0" > /usr/sbin/policy-rc.d && \
    apt-get install -yq libgdiplus \
                        nodejs \
                        jq \
                        yarn && \
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
    component=$(ls  web/ASC.Web.Components/asc-web-components-v1.*.tgz) && \
    common=$(ls web/ASC.Web.Common/asc-web-common-v1.*.tgz) && \
    yarn remove asc-web-components asc-web-common --cwd products/ASC.People/Client && \
    yarn add ../../../$component --cwd products/ASC.People/Client --cache-folder ../../../yarn && \
    yarn add ../../../$common --cwd products/ASC.People/Client --cache-folder ../../../yarn && \
    yarn install --cwd products/ASC.People/Client --frozen-lockfile || (cd products/ASC.People/Client && npm i && cd ../../../) && \
    npm run build --prefix products/ASC.People/Client && \
    mkdir -p /var/www/products/ASC.People/client && \
    cp -Rf products/ASC.People/Client/build/* /var/www/products/ASC.People/client && \
    mkdir -p /var/www/products/ASC.People/client/products/people && \
    yarn cache clean && \
    rm -rf /app/onlyoffice/src && \
    rm -rf /var/lib/apt/lists/*


FROM nginx:stable-alpine AS runtime

COPY --from=builder /var/www/products/ASC.People/client /var/www/products/ASC.People/client
COPY build/install/docker/people.client/onlyoffice-people.conf /etc/nginx/conf.d/
RUN echo "daemon off;" >> /etc/nginx/nginx.conf

EXPOSE 5002

CMD ["/usr/sbin/nginx"]
#ENTRYPOINT ["bash", "-c", "/docker-entrypoint.sh"]
