#Bolt-PostCSS


This extension uses in-browser PostCSS compilation (via browserify) with the following plugins:

 * [postcss-media-variables](https://github.com/WolfgangKluge/postcss-media-variables)
 * [postcss-css-variables](https://github.com/MadLittleMods/postcss-css-variables)
 * [autoprefixer](https://github.com/postcss/autoprefixer)
 * [CSSWring](https://github.com/hail2u/node-csswring)
 * [postcss-calc](https://github.com/postcss/postcss-calc)
 * [postcss-color-function](https://github.com/postcss/postcss-color-function)
 * [postcss-extend](https://github.com/travco/postcss-extend)
 * [postcss-import-url](https://github.com/unlight/postcss-import-url) (Modified to use jQuery instead of node-request and to remove some incompatible dependencies)

##Config

Set the filepaths in the config and make sure all of the files exist and are editable from the bolt backend.

Use the absolute url for @import's, since they are pulled in via a normal AJAX request.

##Example

Say you have this directory structure in your theme:

---

    yourthemename
        css
            styles.css
            styles.pkgd.css
            styles.pkgd.css.map
            modules
                normalize.css
                grid.css
                menu.css

---

Then your styles.css might look like this:

---

    :root {
        --breakpoint-m: 1100px;
        --breakpoint-s: 800px;
        --breakpoint-xs: 500px;
    }
    
    @import "/theme/yourthemename/css/modules/normalize.css";
    @import "/theme/yourthemename/css/modules/grid.css";
    @import "/theme/yourthemename/css/modules/menu.css";

    /* The rest of your styles here */
    
---
    
You can then use the breakpoint variables in the imported CSS files, and it will all get neatly combined and minified to styles.pkgd.css.
