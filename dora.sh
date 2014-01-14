#!/bin/sh
cd /home/slee2/projects/dora
MODE=testing
cd core/
node index.js &
echo $! > /tmp/indexpid
cd ../reflex/
node reflex.js &
echo $! > /tmp/reflexpid

