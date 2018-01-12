# gulp-shopify-critical

> Create critical css snippets for your Shopify theme.

## Installation
The node package and gulp task are inside of the workflow already so there's nothing you need to do there. However, the way that the `critical` gulp task is triggered by the presence of a `critical` setting inside of `.config.json`.

## Usage
In your `.config.json` file you'll need to add a `critical` property to the config object. The value of the property is an array of objects with each object representing a page/template that you'd like to generate a critical stylesheet for. The object has two properties: 
  * `template` - the file name of the template you'd like to generate a critical stylesheet for, minus the `.liquid` extension
  * `url` - the path of the url/page you'd like to use to generate the critical stylesheet. This will be the page that's crawled by the plugin to identify which selectors need to be included in the critical stylesheet. Note that you don't need to include an object every single product/collection/page/whatever that uses that specific template, just one object per template with a url of a page that uses that template.

```env
{
  "critical": [
    { "template": "index", "url": "/" },
    { "template": "product", "url": "/products/good-straight-jeans-blue-087" },
    { "template": "collection", "url": "/collections/skinny-jeans" },
    { "template": "page", "url": "/pages/about-us" },
    { "template": "page.special", "url": "/pages/special-page" }
  ]
}
```

Once you've got your `.config.json` setup with the templates you'd like to create critical stylesheets for, whenever you make a change to any of those templates the `critical` task is triggered. The outcome of the task is the creation of three files, `citical-head.liquid`, `critical.footer.liquid`, and `critical.[template].liquid` (where `[template]` is the name of the template the critical stylesheet was generated for).

Unlike other files that are generated by gulpfile, the location where the generated files are written to is inside the `dev/` directory (more specifically `dev/liquid/snippets`). One of the side effects of this is that when the `critical` task finishes, because files in the `dev/liquid/` directory are being changed, the `copy` task is triggered as well. This is by design and supposed to happen.

The last thing you'll need to do is update your `theme.liquid` file to reference the newly created critical stylesheets. Fortunately, this is pretty easy to do with the `critical.head.liquid` and `critical.footer.liquid` files that are generated. Simply replace the `<link>` tag loading `bvaccel.css` with an `{% include %}` tag loading `critical.head.liquid`, and towards the bottom of the page near the `</body>` tag, add another `{% include %}` tag loading `critical.footer.liquid`.

```liquid
<!-- Stylesheets ================================ -->
  <link rel="stylesheet" href="{{ 'bvaccel.css' | asset_url }}">
```
becomes...
```liquid
<!-- Stylesheets ================================ -->
  {% include 'critical.head' %}
```
also...
```liquid
<!-- Footer Stylesheets ================================ -->
  {% include 'critical.footer' %}
</body>
```

Know that every time you add or remove a template to the setting in `.config.json`, new versions of `critical.head.liquid` and `critical.footer.liquid` are generated. As a result, you don't have to worry about remembering to update another file somewhere else every time you add or remove a template to the settings in `.config.json`.

## Notes

### Preview Themes
This plugin uses your preview theme as the location to grab your critical stylesheet selectors from. As such, if your preview theme is missing features the live production theme has that affect the height or width of the page, you might be generating a critical stylesheet that will cause problems when you deploy to production. As such, try your best to have your development theme match what's in the production theme.

### Triggering `critical` Task
Because the `critical` task is only triggered when you make a change to a template you're generating a critical stylesheet for, you may make a css change that significantly alters the height or width of the page and the selectors that are or aren't included in the critical stylesheet. Be aware that you'll have to save the template(s) associated with those css changes in order to generate a new critical stylesheet.

### Ignoring `http://site-name.myshopify.com/?preview_theme_id=123456789 (403)`
For whatever reason, the package the plugin uses to grab the critical selectors from the webpage logs that it's ignoring the url for the webpage because of a 403 error. Despite this message, everything still works fine. Hopefully this will get fixed in a future release or I'll figure out how to squelch this message.

### Speed of Task
Because the `critical` task needs to make an http request and load up a page, there's two things you should be aware of:
  1. you obviously need to be connected to the internet
  2. depending your internet connection, the task can sometimes a longer amount of time to complete

## Resources
* [Render Blocking CSS | Web Fundamentals | Google Developers](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/render-blocking-css)
* [Critical npm Package](https://github.com/addyosmani/critical)
* [Understanding Critical CSS](https://www.smashingmagazine.com/2015/08/understanding-critical-css/)

## Contribute
or don't. I don't care. up to you.

## Authors
[tshamz](https://github.com/tshamz)
[anguy95](https://github.com/anguy95)

## License
MIT
