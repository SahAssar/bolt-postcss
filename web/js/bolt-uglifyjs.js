$(document).ready(function() {
    var uglifyjs = require('uglifyjs');

    $('<button type="button" class="btn btn-success package" style="margin-left: 24px;"><i class="fa fa-indent"></i> Package JS</button>')
        .insertAfter('.btn-default.confirm');

    $('button.package').on('click', function() {
        $('button#saveeditfile').trigger('click');
    });

    $('button#saveeditfile').on('click', function() {
        var codemirror = $('.CodeMirror')[0].CodeMirror;
        $('button.package i').toggleClass('fa-spinner fa-spin').toggleClass('fa-indent');

        var files = [];
        var filelist = [];

        postCssConfig.jsIncludes.forEach(function(filename, index) {
            filelist[index] = filename;
            if (postCssConfig.currentPath == postCssConfig.editBase + filename) {
                files[index] = codemirror.getValue();
                checkDone();
            } else {
                $.get(filelist[index] + "?q=" + moment().format("YYYYMMDDHHmmss"), function(file) {
                    files[index] = file;
                    checkDone();
                }, 'text');
            }
        });

        function checkDone() {
            done = true;
            postCssConfig.jsIncludes.forEach(function(file, index) {
                if (files[index] == undefined) {
                    done = false;
                }
            });
            if (done) {
                processJS();
            }
        }

        function processJS() {
            var jsmapFile = postCssConfig.jsFile.split('/');
            jsmapFile = jsmapFile[jsmapFile.length - 1] + ".map?q=" + moment().format("YYYYMMDDHHmmss");
            var result = uglifyjs.UglifyJS.minify(files, { fromString: true, filelist: filelist, outSourceMap: jsmapFile });

            if (result) {
                $.post('/' + postCssConfig.backendpath + '/extensions/postcss/updatejsfiles', {
                    processed: result.code,
                    sourcemap: result.map.toString()
                }, function(data) {
                    $('.lastsaved').append('<br> sourcemap & processed files saved');
                    $('button.package i').toggleClass('fa-spinner fa-spin').toggleClass('fa-indent');
                });
            } else {
                alert('Unkown error');
            }
        }
    });
});