#!/bin/bash
cd frontend

yarn build

rm -r ../public/static

mv -uf build/index.html ../templates/index.html

mv -uf build/* ../public/
