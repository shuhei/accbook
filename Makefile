NPM_BIN=node_modules/.bin
WEBPACK=${NPM_BIN}/webpack

all: build

build: copy js

watch:
	${WEBPACK} --watch

js:
	${WEBPACK}

copy:
	mkdir -p public
	cp src/index.html public/
	cp src/app.css public/
	cp node_modules/angular2/node_modules/zone.js/zone.js public/

clean:
	rm -rf public

lint:
	${NPM_BIN}/eslint **/*.{js,es6}
