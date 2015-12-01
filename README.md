Bolt-PostCSS
============

This extension uses in-browser PostCSS compilation (via browserify) with the following plugins:

 * [postcss-media-variables](https://github.com/WolfgangKluge/postcss-media-variables)
 * [postcss-css-variables](https://github.com/MadLittleMods/postcss-css-variables)
 * [autoprefixer](https://github.com/postcss/autoprefixer)
 * [CSSWring](https://github.com/hail2u/node-csswring)
 * [postcss-calc](https://github.com/postcss/postcss-calc)
 * [postcss-color-function](https://github.com/postcss/postcss-color-function)
 * [postcss-extend](https://github.com/travco/postcss-extend)
 * [postcss-import-url](https://github.com/unlight/postcss-import-url) (Modified to use jQuery instead of node-request and to remove some incompatible dependencies)

Set the filepaths in the config and make sure all of the files exist and are editable from the bolt backend.

Use the an absolute url for @import's, since they are pulled in via a normal AJAX request.
