#!/bin/bash

FORCE=false
NEW=false
while [ $1 ]
do
  echo $1
  if [ "$1" == "-f" ]; then
    FORCE=true
  fi
  if [ "$1" == "-n" ]; then
    NEW=true
  fi
  shift
done

REPO="https://github.com/hogsmill/planning-poker.git"
APPS=(
  'planning-poker,planningPokerOrganisations,3004'
  'planning-poker-new,planningPokerNewOrganisations,3034,Planning Poker'
  'planning-poker-guardian,planningPokerGuardianOrganisations,3029,Planning Poker'
  'planning-poker-ratesetter,planningPokerRatesetterOrganisations,3059,Planning Poker'
  'planning-poker-eagile,planningPokerEverydayAgileOrganisations,3067,Planning Poker'
)

for ((i = 0; i < ${#APPS[@]}; i++))
do
  REC="${APPS[$i]}"

  APP=`echo $REC | cut -d, -f1`
  COLLECTION=`echo $REC | cut -d, -f2`
  PORT=`echo $REC | cut -d, -f3`
  APPNAME=`echo $REC | cut -d, -f4`

  echo "------------------------------------------------"
  if [ -z "$APPNAME" ]; then
    echo "Installing $APP ($COLLECTION, $PORT)"
  else
    echo "Installing $APP ($COLLECTION, $PORT, $APPNAME)"
  fi
  echo "------------------------------------------------"

  DIR="/usr/apps/$APP"
  if [ ! -d $DIR ]; then
    git clone $REPO $DIR
  fi
  ENVFILE="$DIR/.env"
  echo "VUE_APP_PORT=$PORT" > $ENVFILE
  echo "VUE_APP_COLLECTION=$COLLECTION" >> $ENVFILE
  if [ ! -z "$APPNAME" ]; then
    echo "VUE_APP_NAME=$APPNAME" >> $ENVFILE
  fi

  cd $DIR
  if [ "$NEW" == "true" ]
  then
    rm $DIR/package-lock.json
    rm -rf $DIR/node_modules
  fi

  PWD=`pwd`
  APP=`basename $PWD`
  git stash
  GIT=`git pull`
  echo $GIT
  if [ "$FORCE" != "true" -a "$GIT" == "Already up to date." ]; then
    exit 0
  fi

  npm install --legacy-peer-deps
  npm run build
  if [ ! -d /var/www/html/$APP/ ]; then
    mkdir /var/www/html/$APP
  fi
  if [ -d /var/www/html/$APP/css ]; then
    rm /var/www/html/$APP/css/*
  else
    mkdir /var/www/html/$APP/css
  fi
  if [ -d /var/www/html/$APP/js ]; then
    rm /var/www/html/$APP/js/*
  else
    mkdir /var/www/html/$APP/js
  fi
  cp -R dist/* /var/www/html/$APP
  if [ -f "src/server.js" ]; then
    SERVER=`ps -ef | grep server.js | grep "/$APP/" | awk {'print $2'}`
    if [ "$SERVER" != "" ]; then
      kill -9 $SERVER
    fi
  fi
  rm -r /usr/apps/$APP/node_modules/.cache/
done

ps -ef | grep php | grep outdated
if [ $? -eq 1 ]; then
  php /usr/apps/monitor/src/lib/outdated.php &
fi
