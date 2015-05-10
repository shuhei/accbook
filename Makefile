NPM_BIN=node_modules/.bin
WEBPACK=${NPM_BIN}/webpack
WATCH=${NPM_BIN}/watch
PARALLEL=${NPM_BIN}/parallelshell

all: build

build: copy js

watch:
	${PARALLEL} "make watch-static" "make watch-js"

watch-js:
	${WEBPACK} --watch

watch-static:
	${WATCH} "make copy" assets -d

js:
	${WEBPACK}

copy:
	mkdir -p public
	cp assets/* public/
	cp node_modules/angular2/node_modules/zone.js/zone.js public/

clean:
	rm -rf public

lint:
	${NPM_BIN}/eslint **/*.{js,es6}

patch:
	sed -i '' "s/Rx.hasOwnProperty('default')/\!Rx.hasOwnProperty('Subject')/g" ./node_modules/angular2/es6/dev/src/facade/async.es6
