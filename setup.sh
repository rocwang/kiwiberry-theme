#!/bin/bash
set -x

designPackageName='kiwiberry'

testFolder="$(dirname $(readlink -e $0))"
magerun="$testFolder/magerun"
localXml="$testFolder/app/etc/local.xml"

mkdir -p "$testFolder"

# Remove local.xml to force reinstall
if [ -f "$localXml" ]
then
    rm -f "$localXml"
fi

# Download Magerun
if [ ! -x "$magerun" ]
then
    wget https://raw.githubusercontent.com/netz98/n98-magerun/master/n98-magerun.phar -O "$magerun"
    chmod +x "$magerun"
fi

# Install Magento for test
"$magerun" install\
    --magentoVersionByName='magento-ce-1.9.0.1'\
    --installationFolder="$testFolder"\
    --dbHost='localhost'\
    --dbUser='root'\
    --dbName='kiwiberry_test'\
    --dbPort='3306'\
    --installSampleData='yes'\
    --baseUrl='http://kiwiberry.vivienchen.dev'\
    --replaceHtaccessFile='no'\
    --useDefaultConfigParams='yes'

# Switch to our theme
"$magerun" --root-dir="$testFolder" config:set 'design/package/name' "$designPackageName"

# Allow Magento template symlinks
"$magerun" --root-dir="$testFolder" config:set 'dev/template/allow_symlink' 1

# Disable Magento cache
"$magerun" --root-dir="$testFolder" cache:disable
