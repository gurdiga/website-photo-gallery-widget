---
layout: default
---

<script src="gallery.js"></script>

## Summary

Suppose you have a folder with images somewhere, auto-indexed with `nginx`, like this one:

<a href="https://sandradodd.com/vlad/">https://sandradodd.com/vlad/</a>

You can make a slide-show gallery out of the photos in that folder like this:

```html
<a gallery href="https://sandradodd.com/vlad/">Photos</a>
```

So, it’s just a normal `<a>` tag, except for the `gallery` attribute. That’s it. Here is an example link for the folder mentioned above: <a gallery href="https://sandradodd.com/vlad/">Click me!</a>

## How does it work?

Include this script in your page:

```html
<script src="https://cdn.jsdelivr.net/gh/gurdiga/gallery@v1.0.1/gallery.js"></script>
```

You can also host it yourself if you prefer, but using the link above has the added benefit of making it easier to get the most up to date [version][0].

[0]: https://github.com/gurdiga/gallery/releases

## Technical Notes

If the page containing the gallery link and the folder with photos are hosted on different servers, the server hosting the photos has to have [CORS][1] enabled for the server hosting the page.

[1]: https://en.wikipedia.org/wiki/Cross-origin_resource_sharing
