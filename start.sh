#!/bin/bash
export MODE=production
cd /home/slee2/projects/dora/core/
node index.js &
echo $! > /tmp/indexpid

cd /home/slee2/projects/dora/reflex/
sleep 5 && node reflex.js &
echo $! > /tmp/reflexpid

