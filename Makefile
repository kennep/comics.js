buildall: buildserver buildclient

buildserver:
	if test ! -d build; then mkdir build; fi
	cp server/*.js build
	cp server/package.json build
	cd build && npm install
	if test ! -f build/npm-shrinkwrap.json; then cd build && npm shrinkwrap; fi

buildclient:
	echo "Not implemented yet"

clean:
	rm -Rf build
