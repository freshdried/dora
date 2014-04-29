#!/bin/bash
npm install
sudo npm link

OLDDIR=$(pwd)
DIR=$(mktemp -d)
cd $DIR
npm link core-client
browserify -r core-client > $OLDDIR/core-client.js &&
cp $OLDDIR/core-client.js $OLDDIR/../web/public/core-client.js
