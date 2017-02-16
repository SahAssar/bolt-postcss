$(document).ready(function() {

    $('<button type="button" class="btn btn-success package" style="margin-left: 24px;"><i class="fa fa-indent"></i> Package CSS</button>')
        .insertAfter('.btn-default.confirm');

    $('button.package').on('click', function() {
        $('button#saveeditfile').trigger('click');
    });

    $('button#saveeditfile').on('click', function() {
        $('button.package i').toggleClass('fa-spinner fa-spin').toggleClass('fa-indent');
        var CSSsourceFileName = postCssConfig.CSSsourceFile.split('/');
        var cssFileName = postCssConfig.cssFile.split('/');
        CSSsourceFileName = CSSsourceFileName[CSSsourceFileName.length - 1];
        cssFileName = cssFileName[cssFileName.length - 1];
        postcsspackage.postcss([
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
            alert(error);
            $('button.package i').toggleClass('fa-spinner fa-spin').toggleClass('fa-indent');
        }).then(function(result) {
            if (result) {
                $.post('/' + postCssConfig.backendpath + '/extensions/postcss/updatecssfiles', {
                    processed: result.css,
                    sourcemap: result.map.toString()
                }, function(data) {
                    $('.lastsaved').append('<br> sourcemap & processed files saved');
                    $('button.package i').toggleClass('fa-spinner fa-spin').toggleClass('fa-indent');
                });
            };
        });
    });
});