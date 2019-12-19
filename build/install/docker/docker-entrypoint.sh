#!/bin/bash

MYSQLIP=`getent hosts mysql | awk '{ print $1 }'`
KAFKAIP=`getent hosts kafka | awk '{ print $1 }'`

sed -i "s/localhost/${MYSQLIP}/" /app/onlyoffice/config/appsettings.test.json
sed -i "s/localhost/${KAFKAIP}/" /app/onlyoffice/config/kafka.test.json

/usr/bin/supervisord --
