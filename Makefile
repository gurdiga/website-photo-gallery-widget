start:
	jekyll serve --trace

edit:
	code -n .

e: edit

install:
	gem install --user-install bundler jekyll jekyll-theme-slate
