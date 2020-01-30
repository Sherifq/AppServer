FROM ubuntu:18.04

ARG RELEASE_DATE="2016-06-21"
ARG RELEASE_DATE_SIGN=""
ARG VERSION="8.9.0.190"
ARG SOURCE_REPO_URL="deb http://static.teamlab.com.s3.amazonaws.com/repo/debian squeeze main"
ARG DEBIAN_FRONTEND=noninteractive

LABEL onlyoffice.community.release-date="${RELEASE_DATE}" \
      onlyoffice.community.version="${VERSION}" \
      maintainer="Ascensio System SIA <support@onlyoffice.com>"

ARG APPS_UID="9000"
ARG APPS_GID="9000"

ENV LANG=en_US.UTF-8 \
    LANGUAGE=en_US:en \
    LC_ALL=en_US.UTF-8

#RUN  groupadd -g ${APPS_UID} -r onlyoffice && useradd -u ${APPS_UID} -r -g onlyoffice -m -s /sbin/nologin onlyoffice
#USER onlyoffice

COPY . /app/onlyoffice/src/

RUN apt-get update -y && \
    apt-get install gnupg2 apt-transport-https ca-certificates sudo locales software-properties-common wget curl cron rsyslog -yq && \
    locale-gen en_US.UTF-8 && \
    apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys 3FA7E0328081BFF6A14DA29AA6A19B38D3D831EF && \
    wget -q https://packages.microsoft.com/config/ubuntu/18.04/packages-microsoft-prod.deb -O packages-microsoft-prod.deb && \
    dpkg -i packages-microsoft-prod.deb && \
    apt-get update -y && \
    echo "#!/bin/sh\nexit 0" > /usr/sbin/policy-rc.d && \
    apt-get install -yq vim \
                        jq \
                        dotnet-sdk-3.1 \
                        supervisor \
                        mysql-client && \
    cd /app/onlyoffice/src/products/ASC.People/Server && \
    dotnet -d publish -o /var/www/products/ASC.People/server && \
    cd /app/onlyoffice/src/ && \
    cp build/install/docker/people.server/supervisord.conf /etc/supervisor/conf.d/ && \
    cp build/install/docker/people.server/docker-entrypoint.sh / && \
    mkdir -p /app/onlyoffice/config/ && cp -rf config/* /app/onlyoffice/config/ && \
    dotnet nuget locals all --clear && \
    rm -rf /var/lib/apt/lists/* && \
    rm -rf /app/onlyoffice/src

EXPOSE 5004

ENTRYPOINT ["bash", "-c", "/docker-entrypoint.sh"]
