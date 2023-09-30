---
layout: default
---

{% if jekyll.environment == "development" %}
<script src="website-photo-gallery-widget.js"></script>
{% else %}
<script src="https://cdn.jsdelivr.net/npm/website-photo-gallery-widget@1.4.0/website-photo-gallery-widget.min.js"></script>
{% endif %}

<style>
a[gallery] {
  font-weight: bold;
}
</style>

## Summary

Suppose you have a folder with images and videos somewhere, auto-indexed with `nginx`, like this one:

<a href="https://sandradodd.com/vlad/sample-images/">https://sandradodd.com/vlad/sample-images/</a>

You can make a slide-show gallery out of the photos and videos in that folder like this:

```html
<a gallery href="https://sandradodd.com/vlad/">Photos</a>
```

So, it’s just a normal `<a>` tag, except for the `gallery` attribute. That’s it.

> Live example: <a gallery href="https://sandradodd.com/vlad/">Gallery</a>.

### Apache auto-indexed folder

It can work the same way with an auto-indexed Apache-hosted folder: you just give the `gallery` attribute the value of "apache".

```html
<a gallery="apache" href="https://example.com/vlad/">Gallery</a>
```

### Advanced: Custom URL loader function

You can also define a custom function that returns the image and video URLs.

```html
<a gallery="customLoaderFunction:loadUrls" href="#">Gallery</a>
```

This setup expects the global `loadUrls` function to exist, and return an array of strings, or a promise of an array of strings. The loader function will receive the gallery link element as its argument.

> Live example: <a gallery="customLoaderFunction:loadUrls" href="https://sandradodd.com/vlad/">Gallery</a>.

Here `loadUrls` is this function:

```js
function loadUrls() {
  return Promise.resolve([
    "https://sandradodd.com/vlad/unsplash-07.jpg",
    "https://sandradodd.com/vlad/unsplash-08.jpg"
  ]);
}
```

<script>
function loadUrls() {
  return Promise.resolve([
    "https://sandradodd.com/vlad/unsplash-07.jpg",
    "https://sandradodd.com/vlad/unsplash-08.jpg"
  ]);
}
</script>

If you want to have multiple galleries on the same page, you’ll have to have different functions for each one.

### Inline image URLs

You can also give it the image URLs inside the `gallery` attribute, like this:

```html
 <a gallery="
    https://sandradodd.com/vlad/unsplash-11.jpg
    https://sandradodd.com/vlad/unsplash-12.jpg
" href="#">Gallery</a>
```

NOTE: The `href` attribute is ignored in this case.

> Live example: <a gallery="
    https://sandradodd.com/vlad/unsplash-11.jpg
    https://sandradodd.com/vlad/unsplash-12.jpg
" href="#">Gallery</a>


## How do I use it?

Include this script in your page:

```html
<script src="https://cdn.jsdelivr.net/npm/website-photo-gallery-widget@1.4.0/website-photo-gallery-widget.min.js"></script>
```

Or get it from NPM:

```shell
npm install website-photo-gallery-widget
```

## A (technical) note for auto-indexed folders

If the photos come from an auto-indexed folder, and the folder lives on a different server, that server needs to allow [CORS][1] access for the widget to be able to fetch the list of photos.

[1]: https://en.wikipedia.org/wiki/Cross-origin_resource_sharing


## Questions? Ideas? Comments?

Post them on [our discussion board][2]!

[2]: https://github.com/gurdiga/website-photo-gallery-widget/discussions
