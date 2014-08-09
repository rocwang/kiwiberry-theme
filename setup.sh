#!/bin/bash
set -x

vendorName='VR'
moduleName='KiwiFruit'
designPackageName='kiwifruit'
projectFolder="$(dirname $(readlink -e $0))"
testFolder="$projectFolder/test"
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
    --dbName='kiwifruit_test'\
    --dbPort='3306'\
    --installSampleData='yes'\
    --baseUrl='http://kiwifruit.vivienchen.dev'\
    --replaceHtaccessFile='no'\
    --useDefaultConfigParams='yes'

# Switch to our theme
"$magerun" --root-dir="$testFolder" config:set 'design/package/name' "$designPackageName"

# Allow Magento template symlinks
"$magerun" --root-dir="$testFolder" config:set 'dev/template/allow_symlink'  1

# Disable Magento cache
"$magerun" --root-dir="$testFolder" cache:disable

codeFolder="$testFolder/app/code/community/$vendorName/$moduleName"
designFolder="$testFolder/app/design/frontend/$designPackageName/default"
moduleEtcFolder="$testFolder/app/etc/modules"

mkdir -p "$codeFolder" "$designFolder" "$moduleEtcFolder"

# Link project file to Magento folder
ln -sft "$codeFolder" ../../../../../../magento/{Block,Helper,Model,etc}
ln -sft "$designFolder" ../../../../../../magento/{layout,template}
ln -sft "$moduleEtcFolder" ../../../../magento/VR_KiwiFruit.xml
