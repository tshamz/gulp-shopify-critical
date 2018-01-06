const through = require('through2');
const PluginError = require('plugin-error');
const critical = require('critical');
const fs = require('fs');
const File = require('vinyl');

// consts
const PLUGIN_NAME = 'gulp-shopify-critical';

const generateCriticalHead = critical => {
  return critical.reduce((data, page, index) => {
    return data += (index === 0) ? `{% if template contains '${page.template}' %}{% include 'critical.${page.template}' %}` : `{% elsif template contains '${page.template}' %}{% include 'critical.${page.template}' %}`;
  }, '').concat(`{% else %}<link rel="stylesheet" type="text/css" href="{{ 'bvaccel.css' | asset_url }}">{% endif %}`);
};

const generateCriticalFooter = critical => {
  return critical.reduce((data, page, index, array) => {
    return data += `template contains '${page.template}'${(index === array.length - 1) ? '' : ' or '}`;
  }, '{% if ').concat(`%}<link rel="stylesheet" type="text/css" href="{{ 'bvaccel.css' | asset_url }}">{% endif %}`);
};

const gulpShopifyCritical = function (options) {
  if (!options) throw new PluginError(PLUGIN_NAME, 'Missing critical options!');

  const stream = through.obj(function (file, enc, cb) {
    const option = options.config.critical.find(option => file.relative === `${option.template}.liquid`);

    if (option) {
      const criticalLiquidHead = generateCriticalHead(options.config.critical);
      const criticalLiquidFooter = generateCriticalFooter(options.config.critical);

      const criticalFileHead = new File({ path: 'critical-head.liquid', contents: new Buffer(criticalLiquidHead) });
      const criticalFileFooter = new File({ path: 'critical-footer.liquid', contents: new Buffer(criticalLiquidFooter) });

      this.push(criticalFileHead);
      this.push(criticalFileFooter);

      const styles = new File({ path: 'styles.css', contents: fs.readFileSync(options.css) });
      critical.generate({
        src: `http://${options.url}${option.url}?preview_theme_id=${options.theme}`,
        css: styles,
        minify: true,
        width: 1440,
        height: 1200
      }).then(output => {
        const criticalFile = new File({ path: `critical.${option.template}.liquid`, contents: new Buffer(`<style>${output}</style>`) });
        this.push(criticalFile);
        cb();
      }).catch(err => {
        console.log(err);
        cb();
      });
    } else {
      cb();
    }
  });

  // returning the file stream
  return stream;
};

// exporting the plugin main function
module.exports = gulpShopifyCritical;
