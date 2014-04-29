#!/bin/bash
MODE=testing
cd core
node index.js &
cd ../reflex
node reflex.js &
