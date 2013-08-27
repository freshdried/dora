#!/bin/bash
npm install
sudo npm link

OLDDIR=$(pwd)
echo $PWD
DIR=$(mktemp -d)
cd $DIR
npm link core-client
browserify -r core-client > $OLDDIR/public/core-client.js
