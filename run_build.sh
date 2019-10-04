#!/bin/bash

command -v nvm

 node --version
 npm --version
 nvm --version
 yarn --version

 yarn

 mkdir bin/
 cp $GOPATH/bin/* bin/

 yarn dev
