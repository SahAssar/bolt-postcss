var fs = require('fs');
var postcss = require('postcss');
var mediaVariables = require('postcss-media-variables');
var cssvariables = require('postcss-css-variables');
var autoprefixer = require('autoprefixer');
var csswring = require('csswring');
var postcsscalc = require('postcss-calc');
var colorFunction = require("postcss-color-function");
var postcssExtend = require("postcss-extend");
var perfectionist = require("perfectionist");
var postcssSorting = require("postcss-sorting");
var postcssGetVariables = require('postcss-get-variables');
var postcssimporturl = require('./postcssimportviajquery.js');

module.exports = {
    postcss: postcss,
    mediaVariables: mediaVariables,
    cssvariables: cssvariables,
    autoprefixer: autoprefixer,
    csswring: csswring,
    postcsscalc: postcsscalc,
    colorFunction: colorFunction,
    postcssExtend: postcssExtend,
    postcssimporturl: postcssimporturl,
    postcssSorting: postcssSorting,
    perfectionist: perfectionist,
    postcssGetVariables: postcssGetVariables
}
