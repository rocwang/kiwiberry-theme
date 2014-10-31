#!/bin/sh

# TODO: Validate before doing next action.

BUILD_PATH="$1"
PACKAGE_NAME="Interface_Frontend_Kiwiberry"
PACKAGE_FILENAME="Interface_Frontend_Kiwiberry-0.1.0.tgz"

# Setup compiling environment
cd "${BUILD_PATH}"
npm install
bower install

# Build
gulp theme --dist

# Install
cd /var/www/kiwiberry.nz
mv -vf "${BUILD_PATH}/${PACKAGE_FILENAME}" .
./mage list-installed | grep -q  ${PACKAGE_NAME} && ./mage uninstall community ${PACKAGE_NAME}
./mage install-file "./${PACKAGE_FILENAME}"
rm -vf "./${PACKAGE_FILENAME}"
