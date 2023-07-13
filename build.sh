#!/bin/bash
#if [ -f ./out/tsb.js ]
#then
#  clear
#  node ./out/tsb.js build
#  exit 0
#fi

clear
tsc
find ./src -maxdepth 4 -type f -name "*.d.ts" -delete
node ./src/core/bin/tsb.js build standalone
node ./out/standalone.js build fast
node ./out/tsb.js build core
find ./src -maxdepth 4 -type f -name "*.js" -delete
find ./src -maxdepth 4 -type f -name "*.js.map" -delete
cd out || exit 1
npm install -g .
cd .. || exit 1