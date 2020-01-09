#!/bin/bash

MYSQLIP=`getent hosts mysql | awk '{ print $1 }'`
KAFKAIP=`getent hosts kafka | awk '{ print $1 }'`

API_HOSTS_IP=`getent hosts $API_HOSTS | awk '{ print $1 }'`
CLIENT_HOSTS_IP=`getent hosts $CLIENT_HOSTS | awk '{ print $1 }'`
PEOPLECLIENT_HOSTS_IP=`getent hosts $PEOPLECLIENT_HOSTS | awk '{ print $1 }'`
PEOPLESERVER_HOSTS_IP=`getent hosts $PEOPLESERVER_HOSTS | awk '{ print $1 }'`
STUDIO_HOSTS_IP=`getent hosts $STUDIO_HOSTS | awk '{ print $1 }'`

tmp=$(mktemp)
jq ".ConnectionStrings.default.connectionString=\"Server=${MYSQLIP};Port=3306;Database=${MYSQL_DATABASE};User ID=${MYSQL_USER};Password=${MYSQL_PASSWORD};Pooling=true;Character Set=utf8;AutoEnlist=false;SSL Mode=Required\"" /app/onlyoffice/config/appsettings.test.json > "$tmp" && mv "$tmp" /app/onlyoffice/config/appsettings.test.json
chown 1000:1000 /app/onlyoffice/config/appsettings.test.json

tmp=$(mktemp)
jq ".kafka.BootstrapServers=\"${KAFKAIP}\"" /app/onlyoffice/config/kafka.test.json > "$tmp" && mv "$tmp" /app/onlyoffice/config/kafka.test.json
chown 1000:1000 /app/onlyoffice/config/kafka.test.json

sed -i "s/server\ api/server\ $API_HOSTS_IP/" /etc/nginx/includes/upstream.conf
sed -i "s/server\ client/server\ $CLIENT_HOSTS_IP/" /etc/nginx/includes/upstream.conf
sed -i "s/server\ people.client/server\ $PEOPLECLIENT_HOSTS_IP/" /etc/nginx/includes/upstream.conf
sed -i "s/server\ people.server/server\ $PEOPLESERVER_HOSTS_IP/" /etc/nginx/includes/upstream.conf
sed -i "s/server\ studio/server\ $STUDIO_HOSTS_IP/" /etc/nginx/includes/upstream.conf

/usr/bin/supervisord --
