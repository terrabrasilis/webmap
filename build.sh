#!/bin/bash

echo "Help"
echo "Call with parameters to customize the build: ./build.sh <VERSION> <BUILD_TYPE>"
echo "VERSION parameter allows (ex.: v1.1 or v1.2-beta among others)"
echo "BUILD_TYPE parameter allows (ex.: developer or production)"
echo ""

# get version number to build image
if [[ ! "$1" = "" ]]; then
    VERSION=$1
else
    echo "Need one number to versioning this image. Enter one:" ; read VERSION
    if [[ "$VERSION" = "" ]]; then
        echo "Read fail! Aborting...."
        exit
    fi
fi

echo "Building terrabrasilis/terrabrasilis-webapp:$VERSION"
echo "...................................................."

# environment to developer or production build
# to homologation use developer
ENV="production"
BUILD_TYPE="production"

if [[ ! "$2" = "" ]]; then
    ENV="dev"
    BUILD_TYPE="homologation"
else
    read -p "I will build on production mode by default. May i continue? If yes, type yes or Ctrl+C to exit. " -d'y' -d'e' -d's' RESPONSE; echo
fi

echo "Building $ENV mode..."
echo "........................"

docker build --no-cache --build-arg ENV=$ENV --build-arg BUILD_TYPE=$BUILD_TYPE -t terrabrasilis/terrabrasilis-webapp:$VERSION -f terrabrasilis-webapp.dockerfile .

echo "The building was finished! Do you want sending this new image to Docker HUB? Type yes to continue." ; read SEND_TO_HUB
if [[ ! "$SEND_TO_HUB" = "yes" ]]; then
    echo "Ok, not send the image."
else
    echo "Nice, sending the image!"
    ./push.sh "$VERSION"
fi