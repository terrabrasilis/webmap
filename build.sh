#!/bin/bash

echo "Help"
echo "Call with parameters to customize the build: ./build.sh <VERSION> <BUILD_TYPE>"
echo "VERSION parameter allows (ex.: v1.1 or v1.2-beta among others)"
echo "VERSION is optional. If no provided, the script will trying load from package.json"
echo "BUILD_TYPE is optional and allows (ex.: staging or production)."
echo ""

ver=$1
btype=$2

# get version number to build image
if [[ ! "$ver" = "" && ! "$ver" = "staging" && ! "$ver" = "production" ]]; then
    VERSION=$ver
else
    
    PACKAGE_VERSION=$(cat package.json | grep -oP '(?<="version": ")[^"]*')
    if [[ ! "$PACKAGE_VERSION" = "" ]]; then
        echo "Auto detect the project version from package.json file and we'll use the version number: v$PACKAGE_VERSION"
        VERSION="v$PACKAGE_VERSION"
    else
        echo "Need one number to versioning this image. Enter one:" ; read VERSION
        if [[ "$VERSION" = "" ]]; then
            echo "Read fail! Aborting...."
            exit
        fi
    fi
fi

echo "Building terrabrasilis/webmap:$VERSION"
echo "...................................................."

# environment to staging or production build
ENV="production"
BUILD_TYPE="production"

if [[ ! "$ver" = "" && "$ver" = "staging" || "$ver" = "production" ]]; then
    btype=$ver
fi

if [[ "$btype" = "" ]]; then
    read -p "I will build on production mode by default. May i continue? If yes, type yes or Ctrl+C to exit. " -d'y' -d'e' -d's' RESPONSE; echo
else

    #if [[ "$btype" = "staging" ]]; then
    #    ENV="dev"
    #    BUILD_TYPE="$btype"
    #fi

    if [[ "$btype" = "staging" ]]; then
        BUILD_TYPE="$btype"
    fi
fi

echo "Building $BUILD_TYPE mode..."
echo "........................"

if [[ "$BUILD_TYPE" = "production" ]]; then
    VERSION="prod_$VERSION"
fi

# --no-cache
docker build --no-cache --build-arg ENV=$ENV --build-arg BUILD_TYPE=$BUILD_TYPE -t terrabrasilis/webmap:$VERSION -f Dockerfile .

echo "The building was finished! Do you want sending this new image to Docker HUB? Type yes to continue." ; read SEND_TO_HUB
if [[ ! "$SEND_TO_HUB" = "yes" ]]; then
    echo "Ok, not send the image."
else
    echo "Nice, sending the image!"
    ./push.sh "$VERSION"
fi