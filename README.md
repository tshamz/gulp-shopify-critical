# gulp-shopify-critical

> Create critical css snippets for your Shopify theme.

## Installation
The node package and gulp task are inside of the workflow already, so there's nothing you need to do in that regard. However, the way that the critical task is triggered inside of the gulpfile is by the presence of a `critical` setting inside of `.config.json`.

## Usage
In your `.config.json` file, you'll need to add a `critical` property to the config object. The value of the property is an array of objects, with each object representing a page that you'd like to generate a critical stylesheet for. The object has two properties: 
  * `template` - the file name of the template you'd like to generate a critical stylesheet for minus the `.liquid` extension
  * `url` - the path of the url/page you'd like to use as the example page when generating the critical stylesheet. This will be the page that's crawled by the plugin to identify which selectors need to be included in the critical stylesheet. You don't need to include an object every single url that uses that specific template, just one object per template that includes an url of an page that uses that template.

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

Once you've got your `.config.json` setup with the templates you'd like to create critical stylesheets for, when you're running `gulp` and make an update to any template 

## Notes

### Preview Themes
This plugin uses your preview theme as the location to grab your critical stylesheet selectors from. As such, if your preview theme is missing features the live production theme has that affect the height or width of the page, you might be generating a critical stylesheet that will cause problems when you deploy to production. As such, try your best to have your development theme match what's in the production theme.

### Triggering `critical` Task
Because the `critical` task is only triggered when you make a change to a template you're generating a critical stylesheet for, you may make a css change that significantly alters the height or width of the page and which selectors are or aren't included in the critical stylesheet. Be aware that you'll have to save the template(s) that are associated with those css changes in order to trigger the `critical` task again to generate a new critical stylesheet.

### Ignoring http://good-american.myshopify.com/?preview_theme_id=132273667 (403)

### Speed of Task

### 

## Contribute

or don't. I don't care.

## Authors
[tshamz](https://github.com/tshamz)

## License
MIT
