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

RUN apt-get update -y && \
    apt-get install gnupg2 apt-transport-https ca-certificates sudo locales software-properties-common wget curl cron rsyslog -yq && \
    addgroup --system --gid 107 onlyoffice && \
    adduser -uid 104 --quiet --home /var/www/onlyoffice --system --gid 107 onlyoffice && \
    locale-gen en_US.UTF-8 && \
    wget -q https://packages.microsoft.com/config/ubuntu/18.04/packages-microsoft-prod.deb -O packages-microsoft-prod.deb && \
    dpkg -i packages-microsoft-prod.deb && \
    apt-get update -y && \
    cd ~ && \
    echo "#!/bin/sh\nexit 0" > /usr/sbin/policy-rc.d && \
    apt-get install -yq vim \
                        jq \
                        dotnet-sdk-3.1 \
                        supervisor \
                        mysql-client && \
    rm -rf /var/lib/apt/lists/

COPY . /app/onlyoffice/src/

RUN cd /app/onlyoffice/src/ && \
    cp build/install/docker/studio.notify/supervisord.conf /etc/supervisor/conf.d/supervisord.conf && \
    mkdir -p /app/onlyoffice/config/ && cp -rf config/* /app/onlyoffice/config/ && \
    cp build/install/docker/studio.notify/docker-entrypoint.sh / && \
    cd common/services/ASC.Studio.Notify && \
    dotnet -d publish -o /var/www/services/studio.notify && \
    dotnet nuget locals all --clear && \
    rm -rf /app/onlyoffice/src

EXPOSE 5006

ENTRYPOINT ["bash", "-c", "/docker-entrypoint.sh"]
