default: watch

watch:
	tsc --watch
c: watch

build:
	npm run build

start:
	npm run docs-preview

edit:
	code -n .

e: edit

install:
	npm install
	npm run docs-preview-install

tag:
	@VERSION=`jq -r .version package.json` && \
	echo git tag -a v$$VERSION -m \"Version $$VERSION\"

release:
	npm run release

publish:
	npm publish
