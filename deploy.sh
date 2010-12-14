#!/bin/bash

echo 'Deploying Mine Defender...'
mkdir deploy
echo 'Copying files to temp deploy directory...'
cp index.html deploy/index.html
cp -R lib/ deploy/lib/
cp -R assets deploy/assets/
cp -R src deploy/src/
echo 'Copying files to remote server...'
scp deploy/index.html minedefendernfs:/home/public/index.html
scp -r deploy/lib/ minedefendernfs:/home/public/lib/
scp -r deploy/assets/ minedefendernfs:/home/public/assets/
scp -r deploy/src/ minedefendernfs:/home/public/src/
echo 'Removing temp deploy directory...'
rm -rf deploy/
echo 'Done.'