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
	@echo "git tag v1.0.0"

release-patch:
	npm run release-patch
