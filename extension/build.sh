#!/bin/sh

# remove previous extension.zip if it exists
rm -f extension.zip

# build source files
yarn build

# zip manifest.json and dist folder only
zip -r extension.zip manifest.json dist
