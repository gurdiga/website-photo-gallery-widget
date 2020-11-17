---
layout: default
---

{% if jekyll.environment == "development" %}
<script src="website-photo-gallery-widget.js"></script>
{% else %}
<script src="https://cdn.jsdelivr.net/npm/website-photo-gallery-widget@1.1.0/website-photo-gallery-widget.min.js"></script>
{% endif %}


## Summary

Suppose you have a folder with images somewhere, auto-indexed with `nginx`, like this one:

<a href="https://sandradodd.com/vlad/">https://sandradodd.com/vlad/</a>

You can make a slide-show gallery out of the photos in that folder like this:

```html
<a gallery href="https://sandradodd.com/vlad/">Photos</a>
```

So, it’s just a normal `<a>` tag, except for the `gallery` attribute. That’s it.

> Example: <a gallery href="https://sandradodd.com/vlad/">Gallery</a>.

### Inline image URLs

You can also give it the image URLs inside the `gallery` attribute, like this:

```html
 <a gallery="
    https://sandradodd.com/vlad/unsplash-11.jpg
    https://sandradodd.com/vlad/unsplash-12.jpg
" href="#">Gallery</a>
```

NOTE: The `href` attribute is ignored in this case.

> Example: <a gallery="
    https://sandradodd.com/vlad/unsplash-11.jpg
    https://sandradodd.com/vlad/unsplash-12.jpg
" href="#">Gallery</a>


## How do I use it?

Include this script in your page:

```html
<script src="https://cdn.jsdelivr.net/npm/website-photo-gallery-widget@1.1.0/website-photo-gallery-widget.min.js"></script>
```

Or get it from NPM:

```shell
npm install website-photo-gallery-widget
```

## Technical Notes for auto-indexed folders

If the photos come from an auto-indexed folder, and the folder lives on a different server, that server needs to allow [CORS][1] access for the widget to be able to fetch the list of photos.

[1]: https://en.wikipedia.org/wiki/Cross-origin_resource_sharing
