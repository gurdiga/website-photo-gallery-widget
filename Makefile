default: watch

watch:
	tsc --watch

build:
	tsc

start:
	jekyll serve --trace

edit:
	code -n .

e: edit

install:
	gem install --user-install jekyll

tag:
	@echo "git tag v1.0.0"

release: tag
