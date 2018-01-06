# gulp-shopify-critical

> Create critical css snippets for your Shopify theme.

## Install

```
npm i gulp-shopify-crtical --save-dev
```

## Usage

```
gulp.task('critical', ['styles'], () => {
  return gulp.src(['dev/liquid/templates/*.liquid'])
    .pipe(plumber(plumberErrorHandler))
    .pipe(changed('deploy/templates/', { hasChanged: changed.compareSha1Digest }))
    .pipe(shopifyCritical({ url: process.env.URL, theme: process.env.THEME_ID, config, css: './deploy/assets/bvaccel.css.liquid'}))
    .pipe(gulp.dest('deploy/snippets/'));
});
```

## Contribute

or don't. I don't care.

## Authors
[tshamz](https://github.com/tshamz)

## License
MIT
