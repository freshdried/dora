#!/bin/bash
cd core-client/
./build.sh
cd ../reflex/
npm link core-client
