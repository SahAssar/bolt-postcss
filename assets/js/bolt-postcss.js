var plugins = require('postcsspackage');


$('<button type="button" class="btn btn-success package" style="margin-left: 24px;"><i class="fa fa-indent"></i> Package CSS</button>')
.insertAfter('.btn-default.confirm');

$('button.package').on('click',function(){
    $('button#saveeditfile').trigger('click');
});

$('button#saveeditfile').on('click',function(){
    var codemirror = $('.CodeMirror')[0].CodeMirror;
    $('button.package i').toggleClass('fa-spinner fa-spin').toggleClass('fa-indent');
    
    if(postCssUglifyJSconfig.onCSSSourceFileEditPage){
        processCSS($('.CodeMirror').get(0).CodeMirror.getValue());
    }else{
        $.get(postCssUglifyJSconfig.themePath + postCssUglifyJSconfig.CSSsourceFile + "?q="+moment().format("YYYYMMDDHHmmss") , function(styles){
            processCSS(styles);
        });
    }
    function processCSS(styles){
        
        var CSSsourceFileName = postCssUglifyJSconfig.CSSsourceFile.split('/');
        var cssFileName = postCssUglifyJSconfig.cssFile.split('/');
        CSSsourceFileName = CSSsourceFileName[CSSsourceFileName.length-1];
        cssFileName = cssFileName[cssFileName.length-1];
        
        plugins.postcss([
            plugins.postcssimporturl(),
            plugins.postcssimporturl(),
            plugins.mediaVariables(),
            plugins.cssvariables(),
            plugins.postcsscalc(),
            plugins.mediaVariables(),
            plugins.colorFunction(),
            plugins.autoprefixer({ browsers: ['last 2 versions'] }),
            plugins.postcssExtend(),
            plugins.csswring()
        ])
        .process(styles, {
            from: CSSsourceFileName,
            to: cssFileName,
            map: { inline: false }
        }).catch(function(result) {
            alert(result);
            $('button.package i').toggleClass('fa-spinner fa-spin').toggleClass('fa-indent');
        })
        .then(function (result) {
            if(result){
                var done = false;
                var csstempel = $('<div></div>');
                $('body').append(csstempel);
                csstempel.load(postCssUglifyJSconfig.editPath + postCssUglifyJSconfig.cssFile + ' #form__token', function () {
                    var cssToken = csstempel.find('input').attr('value');
                    csstempel.remove();
                    result.css = result.css.replace(".css.map",".css.map?q="+moment().format("YYYYMMDDHHmmss"));
                    var cssopts = {
                        "form[_token]": cssToken,
                        "form[contents]": result.css
                    }
                    $.post(postCssUglifyJSconfig.editPath + postCssUglifyJSconfig.cssFile + '?returnto=ajax', cssopts, function(data){
                        $('.lastsaved').append('<br>'+data.msg);
                        if (done) {
                            $('button.package i').toggleClass('fa-spinner fa-spin').toggleClass('fa-indent');
                        } else {
                            done = true;
                        }
                    });
                });
                var maptempel = $('<div></div>');
                $('body').append(maptempel);
                maptempel.load(postCssUglifyJSconfig.editPath + postCssUglifyJSconfig.cssFile + '.map #form__token', function () {
                    var mapToken = maptempel.find('input').attr('value');
                    maptempel.remove();
                    var mapopts = {
                        "form[_token]": mapToken,
                        "form[contents]": result.map.toString()
                    }
                    $.post(postCssUglifyJSconfig.editPath + postCssUglifyJSconfig.cssFile + '.map?returnto=ajax', mapopts, function(data){
                        $('.lastsaved').append('<br>'+data.msg);
                        if (done) {
                            $('button.package i').toggleClass('fa-spinner fa-spin').toggleClass('fa-indent');
                        } else {
                            done = true;
                        }
                    });
                });
            }else{
                alert('Unkown error');
            }
        });
    };
});