#if [ -f ./out/tsb.js ]
#then
#  clear
#  node ./out/tsb.js build
#  exit 0
#fi

clear
tsc
node ./src/core/bin/tsb.js build
node ./out/tsb.js build --write-ts
find ./src -maxdepth 4 -type f -name "*.js" -delete
find ./src -maxdepth 4 -type f -name "*.js.map" -delete
find ./src -maxdepth 4 -type f -name "*.d.ts" -delete
find ./src -maxdepth 4 -type f -name "*.d.ts.map" -delete
cd out || exit 1
npm install -g .
cd .. || exit 1