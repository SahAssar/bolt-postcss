var scripts= document.getElementsByTagName('script');
var path= scripts[scripts.length-1].src.split('?')[0];      // remove any ?query
var mydir= path.split('/').slice(0, -1).join('/')+'/';
var uglifyJsWorker = new Worker(mydir + 'uglify-js-worker.js');
uglifyJsWorker.postMessage({path: mydir});
uglifyJsWorker.onmessage = function(e) {
    if(e.data.err){
        alert(e.data.err.message);
        return;
    }
    $.post('/' + postCssConfig.backendpath + '/extensions/postcss/updatejsfiles', {
        processed: e.data.result.code,
        sourcemap: ''
    }, function(data) {
        $('.lastsaved').append('<br> sourcemap & processed files saved');
        $('button.package i').toggleClass('fa-spinner fa-spin').toggleClass('fa-indent');
    });
}

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
        var files = {};
        codemirror.getValue().replace(/^(?![\/\*])(.*)?require\(\s*["']([^"']*)["']\s*\)/gmi, function (_, prefix, filename) {
            deps.push(filename);
            files[filename] = '';
            return prefix + 'require(' + filename + ')';
        });

        deps.forEach(function(filename, index) {
            $.get(filename + "?q=" + moment().format("YYYYMMDDHHmmss"), function(content) {
                var regex = new RegExp("^(?![\/\*])(.*)?require\\(\\s*[\"']"+filename+"[\"']\\s*\\);","gmi");
                deps.splice(deps.indexOf(filename), 1);
                files[filename] = content;
                res = res.replace(regex, '');
                checkDone();
            }, 'text');
        });

        function checkDone() {
            if (!deps[0]) {
                processJS();
            }
        }

        checkDone();

        function processJS() {
            files["scripts.js"] = res;
            uglifyJsWorker.postMessage({files: files});
        }
    });
});
