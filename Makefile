.ONESHELL:

default: watch

watch:
	tsc --watch
c: watch

build:
	npm run build

start:
	JEKYLL_ENV=development npm run docs-preview

edit:
	code -n .

e: edit

install:
	npm install
	npm run docs-preview-install

tag-minor:
	@set -x
	VERSION=`jq -r .version package.json` && \
	NEXT_VERSION=`semver --increment minor $$VERSION` && \
	git tag -a v$$NEXT_VERSION -m "Version $$NEXT_VERSION"

tag-patch:
	@set -x
	VERSION=`jq -r .version package.json` && \
	NEXT_VERSION=`semver --increment patch $$VERSION` && \
	git tag -a v$$NEXT_VERSION -m "Version $$NEXT_VERSION"

# Before this, make tag-patch or tag-minor
release:
	npm run release && \
	make update-docs && \
	make publish

publish:
	npm publish

update-docs:
	@VERSION=`jq -r .version package.json` && \
	sed -E -i "s|/website-photo-gallery-widget@[0-9]+.[0-9]+.[0-9]+/|/website-photo-gallery-widget@$$VERSION/|" index.md && \
	git commit index.md -m "Update version in docs"

