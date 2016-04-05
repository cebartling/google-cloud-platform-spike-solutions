#!/bin/bash --login
set -e

COLOR_LIGHT_GREEN='\033[1;32m'
COLOR_OFF='\033[0m'
export NODEJS_RUNTIME_VERSION=`cat ./.nvmrc`
export NVM_DIR="$HOME/.nvm"

printf "\n${COLOR_LIGHT_GREEN}===> NODEJS_RUNTIME_VERSION set to ${NODEJS_RUNTIME_VERSION}${COLOR_OFF}\n"

printf "\n${COLOR_LIGHT_GREEN}===> Removing local node_modules...${COLOR_OFF}\n"
rm -rf ./node_modules

printf "\n${COLOR_LIGHT_GREEN}===> Removing local bower_components...${COLOR_OFF}\n"
rm -rf ./bower_components

printf "\n${COLOR_LIGHT_GREEN}===> Sourcing nvm...${COLOR_OFF}\n"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" # This loads nvm

printf "\n${COLOR_LIGHT_GREEN}===> Installing node runtime ${NODEJS_RUNTIME_VERSION} via nvm...${COLOR_OFF}\n"
nvm install $NODEJS_RUNTIME_VERSION

printf "\n${COLOR_LIGHT_GREEN}===> Installing installing the latest version of bower...${COLOR_OFF}\n"
npm install -g bower@latest

printf "\n${COLOR_LIGHT_GREEN}===> Installing node packages via npm...${COLOR_OFF}\n"
npm install

printf "\n${COLOR_LIGHT_GREEN}===> Rebuilding the node-sass binding...${COLOR_OFF}\n"
npm rebuild node-sass

printf "\n${COLOR_LIGHT_GREEN}===> Installing web packages via bower...${COLOR_OFF}\n"
bower install

printf "\n${COLOR_LIGHT_GREEN}===> Done!${COLOR_OFF}\n"
