$(document).ready(function() {

    $('<button type="button" class="btn btn-success package" style="margin-left: 24px;"><i class="fa fa-indent"></i> Package CSS</button>')
        .insertAfter('.btn-default.confirm');
    $('<button type="button" class="btn btn-success beautifysort" style="margin-left: 24px;"><i class="fa fa-indent"></i> Beautify CSS</button>')
        .insertAfter('.btn-default.confirm');
    $('<button type="button" class="btn btn-success beautifysortcompact" style="margin-left: 24px;"><i class="fa fa-indent"></i> Beautify CSS (compact)</button>')
        .insertAfter('.btn-default.confirm');
    $('button.package').on('click', function() {
        $('button#saveeditfile').trigger('click');
    });

    $('.beautifysortcompact').on('click', function() {
        var selected = $('.CodeMirror').get(0).CodeMirror.getSelection();
        if (!selected) {
            var selected = $('.CodeMirror').get(0).CodeMirror.getValue();
        }
        console.log(selected)
        var CSSsourceFileName = postCssConfig.CSSsourceFile.split('/');
        var cssFileName = postCssConfig.cssFile.split('/');
        CSSsourceFileName = CSSsourceFileName[CSSsourceFileName.length - 1];
        cssFileName = cssFileName[cssFileName.length - 1];
        postcsspackage.postcss([
            postcsspackage.postcssSorting({
                "clean-empty-lines": true,
                "declaration-empty-line-before": false,
                "properties-order": [
                    {
                        emptyLineBefore: true,
                        properties: [
                            "position",
                            "z-index",
                            "zindex",
                            "top",
                            "right",
                            "bottom",
                            "left",
                        ]
                    },
                    {
                        emptyLineBefore: true,
                        properties: [
                            "display",
                            "overflow",
                            "box-sizing",
                            "width",
                            "height",
                            "padding",
                            "padding-top",
                            "padding-right",
                            "padding-bottom",
                            "padding-left",
                            "border",
                            "border-top",
                            "border-right",
                            "border-bottom",
                            "border-left",
                            "margin",
                            "margin-top",
                            "margin-right",
                            "margin-bottom",
                            "margin-left",
                        ]
                    },
                    {
                        emptyLineBefore: true,
                        properties: [
                            "background",
                            "background-size",
                            "background-image",
                            "background-position",
                            "background-color",
                            "color",
                            "text-shadow",
                            "fill"
                        ]
                    },
                    {
                        emptyLineBefore: true,
                        properties: [
                            "font",
                            "font-family",
                            "font-size",
                            "line-height",
                            "text-align"
                        ]
                    },
                    {
                        emptyLineBefore: true,
                        properties: [
                            "transform",
                            "opacity",
                            "transition",
                            "animation",
                            "animation-name",
                            "animation-duration",
                            "animation-timing-function",
                            "animation-delay",
                            "animation-iteration-count",
                            "animation-direction",
                            "animation-fill-mode",
                            "animation-play-state"
                        ]
                    }
                ],
                "unspecified-properties-position": "bottom"
            }),
            postcsspackage.perfectionist({
                "format": "compact",
                "colorCase": "upper"
            }),
        ]).process(
            selected
        ).catch(function(error) {
            console.log(error);
            alert(error);
        }).then(function(result) {
            if (result) {
                if ($('.CodeMirror').get(0).CodeMirror.getSelection()) {
                    $('.CodeMirror').get(0).CodeMirror.replaceSelection(result.css);
                } else {
                    $('.CodeMirror').get(0).CodeMirror.setValue(result.css);
                }
            };
        });
    });
    $('.beautifysort').on('click', function() {
        var selected = $('.CodeMirror').get(0).CodeMirror.getSelection();
        if (!selected) {
            var selected = $('.CodeMirror').get(0).CodeMirror.getValue();
        }
        console.log(selected)
        var CSSsourceFileName = postCssConfig.CSSsourceFile.split('/');
        var cssFileName = postCssConfig.cssFile.split('/');
        CSSsourceFileName = CSSsourceFileName[CSSsourceFileName.length - 1];
        cssFileName = cssFileName[cssFileName.length - 1];
        postcsspackage.postcss([
            postcsspackage.postcssSorting({
                "clean-empty-lines": true,
                "declaration-empty-line-before": false,
                "properties-order": [
                    {
                        emptyLineBefore: false,
                        properties: [
                            "position",
                            "z-index",
                            "zindex",
                            "top",
                            "right",
                            "bottom",
                            "left",
                        ]
                    },
                    {
                        emptyLineBefore: false,
                        properties: [
                            "display",
                            "overflow",
                            "box-sizing",
                            "width",
                            "max-width",
                            "height",
                            "max-height",
                            "padding",
                            "padding-top",
                            "padding-right",
                            "padding-bottom",
                            "padding-left",
                            "border",
                            "border-top",
                            "border-right",
                            "border-bottom",
                            "border-left",
                            "margin",
                            "margin-top",
                            "margin-right",
                            "margin-bottom",
                            "margin-left",
                        ]
                    },
                    {
                        emptyLineBefore: false,
                        properties: [
                            "background",
                            "background-size",
                            "background-image",
                            "background-position",
                            "background-color",
                            "color",
                            "text-shadow",
                            "fill"
                        ]
                    },
                    {
                        emptyLineBefore: false,
                        properties: [
                            "font",
                            "font-family",
                            "font-size",
                            "line-height",
                            "text-align"
                        ]
                    },
                    {
                        emptyLineBefore: false,
                        properties: [
                            "transform",
                            "opacity",
                            "transition",
                            "animation",
                            "animation-name",
                            "animation-duration",
                            "animation-timing-function",
                            "animation-delay",
                            "animation-iteration-count",
                            "animation-direction",
                            "animation-fill-mode",
                            "animation-play-state"
                        ]
                    }
                ],
                "unspecified-properties-position": "bottom"
            }),
            postcsspackage.perfectionist({
                "colorCase": "upper"
            }),
        ]).process(
            selected
        ).catch(function(error) {
            console.log(error);
            alert(error);
        }).then(function(result) {
            if (result) {
                if ($('.CodeMirror').get(0).CodeMirror.getSelection()) {
                    $('.CodeMirror').get(0).CodeMirror.replaceSelection(result.css);
                } else {
                    $('.CodeMirror').get(0).CodeMirror.setValue(result.css);
                }
            };
        });
    });

    $('button#saveeditfile').on('click', function() {
        $('button.package i').toggleClass('fa-spinner fa-spin').toggleClass('fa-indent');
        var CSSsourceFileName = postCssConfig.CSSsourceFile.split('/');
        var cssFileName = postCssConfig.cssFile.split('/');
        CSSsourceFileName = CSSsourceFileName[CSSsourceFileName.length - 1];
        cssFileName = cssFileName[cssFileName.length - 1];
        var variables = {}
        postcsspackage.postcss([
            postcsspackage.postcssGetVariables(function(parsedVariables) {
                variables = parsedVariables;
            }),
            postcsspackage.postcssimporturl(),
            postcsspackage.postcssimporturl(),
            postcsspackage.cssvariables(),
            postcsspackage.postcsscalc(),
            postcsspackage.autoprefixer({ browsers: ['last 2 versions'] }),
            postcsspackage.postcssExtend(),
            postcsspackage.csswring()
        ]).process($('.CodeMirror').get(0).CodeMirror.getValue(), {
            from: CSSsourceFileName,
            to: cssFileName,
            map: { inline: false }
        }).catch(function(error) {
            console.log(error);
            alert(error);
            $('button.package i').toggleClass('fa-spinner fa-spin').toggleClass('fa-indent');
        }).then(function(result) {
            if (result) {
                $.post('/' + postCssConfig.backendpath + '/extensions/postcss/updatecssfiles', {
                    processed: result.css,
                    sourcemap: result.map.toString(),
                    variables: JSON.stringify(variables)
                }, function(data) {
                    $('.lastsaved').append('<br> sourcemap & processed files saved');
                    $('button.package i').toggleClass('fa-spinner fa-spin').toggleClass('fa-indent');
                });
            };
        });
    });
});