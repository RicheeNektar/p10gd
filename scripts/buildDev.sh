#!/bin/bash
composer install

cd frontend

yarn install
yarn build

rm -r ../public/static

mv -uf build/index.html ../templates/index.html

mv -uf build/* ../public/
