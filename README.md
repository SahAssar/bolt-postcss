#Bolt-PostCSS/UglifyJS


This extension uses in-browser PostCSS compilation (via browserify) with the
following plugins:

 * [postcss-media-variables](https://github.com/WolfgangKluge/postcss-media-variables)
 * [postcss-css-variables](https://github.com/MadLittleMods/postcss-css-variables)
 * [autoprefixer](https://github.com/postcss/autoprefixer)
 * [CSSWring](https://github.com/hail2u/node-csswring)
 * [postcss-calc](https://github.com/postcss/postcss-calc)
 * [postcss-color-function](https://github.com/postcss/postcss-color-function)
 * [postcss-extend](https://github.com/travco/postcss-extend)
 * [postcss-import-url](https://github.com/unlight/postcss-import-url) 
 (Modified to use jQuery instead of node-request and to remove some
 incompatible dependencies)
 
It can also do JS minification/uglifying via the UglifyJS settings.

##Config

Set the filepaths in the config and make sure all of the files exist (including
the .map files).

Use the absolute url for @import's in the CSS, since they are pulled in via a
normal AJAX request.

##Example (PostCSS)

Say you have this directory structure in your theme:

---

    yourthemename:
        css:
            styles.css
            styles.pkgd.css
            styles.pkgd.css.map
            modules:
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

    /* Some more styles */
    
---
    
You can then use the breakpoint variables in the imported CSS files, and it
will all get neatly combined and minified to styles.pkgd.css.


##Example (UglifyJS)

Say you have this directory structure in your theme:

---

    yourthemename:
        js:
            scripts.js
            scripts.pkgd.js
            scripts.pkgd.js.map
            modules:
                jquery-2.1.4.js
                slick-1.5.9.js
                magnific-popup-1.0.0.js

---

Then you would use this config:

    jsFile: /js/scripts.pkgd.js
    
    jsIncludes:
        - /js/modules/jquery-2.1.4.js
        - /js/modules/slick-1.5.9.js
        - /js/modules/magnific-popup-1.0.0.js
        - /js/scripts.js
        
---

And then any time you save one of those JS files it will recomplie a new
`scripts.pkgd.js` that contains all your code.

##Compatability

It is compatible with Chrome, FF and MS edge. It is not compatible with IE
since it uses promises.
