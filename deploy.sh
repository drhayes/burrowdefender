#!/bin/bash

echo 'Deploying Mine Defender...'
git checkout gh-pages && git checkout master index.html lib/ src/ assets/
echo 'Committing changes...'
var DATE=`date`
git commit -am "Update to Mine Defender for $DATE"
echo 'Pushing changes...'
git push origin gh-pages
echo 'Switching back to master...'
git checkout master
