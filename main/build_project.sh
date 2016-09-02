#!/bin/bash

#Retrieve/update submodule if not yet done.
git submodule init
git submodule update

#If no project build currently exists, create the directory for it.
mkdir -p project-build

#Move all VM information for migration into new project-build, suppressing errors if no VM exists.
mkdir tmp
cp -rf project-build/main-web-app/Vagrant/.vagrant/machines/default/virtualbox/* tmp 2>/dev/null || :

#Empty out the build and initialize with current version of OxForMongo.
rm -rf project-build/*
cp -rf ox-submodule/* project-build

#Change initial name of directory from app-blank to main-web-app.
mv project-build/app-blank project-build/main-web-app

#Remove any unneeded files or files to be replaced from fresh project.
rm -rf project-build/main-web-app/constructs/root/*
rm project-build/main-web-app/webroot/.htaccess
rm project-build/main-web-app/config/app.php
rm project-build/main-web-app/Vagrant/Vagrantfile
rm project-build/main-web-app/Vagrant/bootstrap.sh

#Create any missing directories.
mkdir -p project-build/main-web-app/webroot/js
mkdir -p project-build/main-web-app/Vagrant/.vagrant
mkdir -p project-build/main-web-app/Vagrant/.vagrant/machines
mkdir -p project-build/main-web-app/Vagrant/.vagrant/machines/default
mkdir -p project-build/main-web-app/Vagrant/.vagrant/machines/default/virtualbox

#Copy project files over into project build.
cp -rf main-web-app/constructs/jobs project-build/main-web-app/constructs
cp -rf main-web-app/constructs/root/* project-build/main-web-app/constructs/root
cp main-web-app/constructs/_common/layouts/edit.php project-build/main-web-app/constructs/_common/layouts
cp -rf main-web-app/webroot/js/* project-build/main-web-app/webroot/js
cp -rf main-web-app/webroot/css/* project-build/main-web-app/webroot/css
cp -rf main-web-app/lib/* project-build/main-web-app/lib
cp -rf passwd project-build/passwd
cp main-web-app/Vagrant/Vagrantfile project-build/main-web-app/Vagrant
cp main-web-app/Vagrant/bootstrap.sh project-build/main-web-app/Vagrant

##For custom application configuration (e.g. production environment).
if [ -a app.php ] ;
	then cp app.php project-build/main-web-app/config ;
	else cp main-web-app/config/app.php project-build/main-web-app/config ;
fi

##For custom .htaccess configuration (e.g. production environment).
if [ -a .htaccess ] ;
	then cp .htaccess project-build/main-web-app/webroot ;
	else cp main-web-app/webroot/.htaccess project-build/main-web-app/webroot ;
fi

##For custom Vagrantfile configuration (e.g. production environment).
if [ -a Vagrantfile ] ;
	then cp Vagrantfile project-build/main-web-app/Vagrant ;
	else cp main-web-app/Vagrant/Vagrantfile project-build/main-web-app/Vagrant ;
fi

##For custom bootstrap.sh configuration (e.g. production environment).
if [ -a bootstrap.sh ] ;
	then cp bootstrap.sh project-build/main-web-app/Vagrant ;
	else cp main-web-app/Vagrant/bootstrap.sh project-build/main-web-app/Vagrant ;
fi

#Migrate any pre-existing VM information into project.
cp -rf tmp/* project-build/main-web-app/Vagrant/.vagrant/machines/default/virtualbox 2>/dev/null || :
rm -rf tmp