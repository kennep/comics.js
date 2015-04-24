builddev: buildserver buildclient_dev
buildall: buildserver buildclient_prod

buildserver:
	if test ! -d build; then mkdir build; fi
	cp server/*.js build
	cp server/package.json build
	cd build && npm install
	if test ! -f build/npm-shrinkwrap.json; then cd build && npm shrinkwrap; fi

buildclient_common: buildserver
	if test ! -d build/client; then mkdir build/client; fi
	cp client/package.json build/client
	cd build/client && npm install
	if test ! -f build/client/npm-shrinkwrap.json; then cd build/client && npm shrinkwrap; fi;
	cp -R client/public build/
	if test ! -d build/public/css; then mkdir build/public/css; fi
	cp build/client/node_modules/bootstrap/dist/css/bootstrap.css build/public/css/bootstrap.css
	build/client/node_modules/.bin/jsx client/src build/client/src
	
buildclient_dev: buildclient_common
	cd build/client && node_modules/.bin/browserify -d -p [minifyify --map bundle.map.json --output ../public/bundle.map.json] src/index.js > ../public/bundle.js
	cd build/public && if test ! -e node_modules; then ln -s ../client/node_modules node_modules; fi
	cd build/public && if test ! -e src; then ln -s ../client/src src; fi

buildclient_prod: buildclient_common
	cd build/client && node_modules/.bin/browserify -p [minifyify --no-map] src/index.js > ../public/bundle.js

dist: buildall
	if test ! -d dist; then mkdir dist; fi
	tar -czf dist/comics.tgz build/

docker: buildall
	cp Dockerfile build/
	docker build -t comics-js-app build/

clean:
	rm -Rf build dist
