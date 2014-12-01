buildall: buildserver buildclient

buildserver:
	if test ! -d build; then mkdir build; fi
	cp server/*.js build
	cp server/package.json build
	cd build && npm install
	if test ! -f build/npm-shrinkwrap.json; then cd build && npm shrinkwrap; fi

buildclient: buildserver
	if test ! -d build/client; then mkdir build/client; fi
	cp client/package.json build/client
	cd build/client && npm install
	if test ! -f build/client/npm-shrinkwrap.json; then cd build/client && npm shrinkwrap; fi;
	cp -R client/public build/
	if test ! -d build/public/css; then mkdir build/public/css; fi
	cp build/client/node_modules/bootstrap/dist/css/bootstrap.css build/public/css/bootstrap.css
	build/client/node_modules/.bin/jsx client/src build/client/src
	build/client/node_modules/.bin/browserify --debug build/client/src/index.js > build/public/bundle.js
clean:
	rm -Rf build
