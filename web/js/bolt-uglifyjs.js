$(document).ready(function() {

    $('<button type="button" class="btn btn-success package" style="margin-left: 24px;"><i class="fa fa-indent"></i> Package JS</button>')
        .insertAfter('.btn-default.confirm');

    $('button.package').on('click', function() {
        $('button#saveeditfile').trigger('click');
    });

    $('button#saveeditfile').on('click', function() {
        var codemirror = $('.CodeMirror')[0].CodeMirror;
        $('button.package i').toggleClass('fa-spinner fa-spin').toggleClass('fa-indent');

        var res = codemirror.getValue();
        var deps = [];
        codemirror.getValue().replace(/^(?![\/\*])(.*)?require\(\s*["']([^"']*)["']\s*\)/gmi, function (_, prefix, file) {
            deps.push(file);
            return prefix + 'require(' + file + ')';
        });

        deps.forEach(function(filename, index) {
            $.get(filename + "?q=" + moment().format("YYYYMMDDHHmmss"), function(content) {
                var regex = new RegExp("^(?![\/\*])(.*)?require\\(\s*[\"']"+filename+"[\"']\s*\\)","gmi");
                deps.splice(deps.indexOf(filename), 1);
                res = res.replace(regex, content);
                checkDone();
            }, 'text');
        });

        function checkDone() {
            if (!deps[0]) {
                processJS();
            }
        }

        function processJS() {
            var jsmapFile = postCssConfig.jsFile.split('/');
            jsmapFile = jsmapFile[jsmapFile.length - 1] + ".map?q=" + moment().format("YYYYMMDDHHmmss");
            try {
                var result = uglifyjspackage.uglifyjs.minify([res], { fromString: true, filelist: ["scripts.js"], outSourceMap: jsmapFile });
                $.post('/' + postCssConfig.backendpath + '/extensions/postcss/updatejsfiles', {
                    processed: result.code,
                    sourcemap: result.map.toString()
                }, function(data) {
                    $('.lastsaved').append('<br> sourcemap & processed files saved');
                    $('button.package i').toggleClass('fa-spinner fa-spin').toggleClass('fa-indent');
                });
            }
            catch (e) {
                alert(e);
                $('button.package i').toggleClass('fa-spinner fa-spin').toggleClass('fa-indent');
            }
        }
    });
});
