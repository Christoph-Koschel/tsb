#!/bin/bash

find ./src -maxdepth 4 -type f -name "*.d.ts" -delete
find ./src -maxdepth 4 -type f -name "*.js" -delete
find ./src -maxdepth 4 -type f -name "*.js.map" -delete