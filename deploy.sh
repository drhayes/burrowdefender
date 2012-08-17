#!/bin/bash

echo 'Deploying Burrow Defender...'
mkdir deploy
echo 'Copying files to temp deploy directory...'
cp index.html deploy/index.html
cp -R lib/ deploy/lib/
mkdir deploy/assets/
cp -R assets/images deploy/assets/images/
cp -R src deploy/src/
echo 'Copying files to remote server...'
rsync -rav deploy/ minedefendernfs:/home/public/
echo 'Removing temp deploy directory...'
rm -rf deploy/
echo 'Done.'
