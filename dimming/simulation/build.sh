#!/bin/bash
npm install arduino-zmq-proxy virtual-arduino
cd ./node_modules/arduino-zmq-proxy/node_modules/zmq/
nw-gyp rebuild --python=/usr/bin/python2 --target=0.10.3

