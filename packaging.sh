#!/bin/sh
tar -cf kiwiberry.tar -C . app -C ./dist skin
magento-tar-to-connect.phar
rm -rf ./dist ./var
