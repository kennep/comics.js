#!/bin/bash -xe

# Copy credentials. These are not included in the source repo, so 
# must be available in this directory before the container is run
cp -a /credentials/.ssh /root/.ssh
chown 700 /root/.ssh && chown 600 /root/.ssh/*

cd /root/openshift
git clone ssh://56f300760c1e663d3e000136@comics-wangpedersen.rhcloud.com/~/git/comics.git/

cp -a /usr/src/app/package.json /root/openshift/comics/
cp -a /usr/src/app/build /root/openshift/comics/

cd comics

git config user.email kenneth@wangpedersen.com
git config user.name "Kenneth Pedersen"
git config push.default simple

git add -f package.json build/
git commit --allow-empty -m "Build $BUILD_NUMBER"
git push
