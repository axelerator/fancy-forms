#!/bin/bash

project_root=$(dirname $0)/..
$(dirname $0)/build.sh 

mkdir $project_root/dist
cp $project_root/main.js $project_root/dist
cp $project_root/index.html $project_root/dist
cp -r $project_root/css $project_root/dist
