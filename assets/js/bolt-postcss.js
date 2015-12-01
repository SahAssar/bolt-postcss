var plugins = require('postcsspackage')
$('button.package').on('click',function(){
    $('button#saveeditfile').trigger('click');
});
$('button#saveeditfile').on('click',function(){
    $('button.package i').toggleClass('fa-spinner fa-spin').toggleClass('fa-indent');
    $.get(postCSSconfig.themePath + postCSSconfig.sourceFile , function(styles){
        styles = postCSSconfig.onPage ? form_contents.value : styles;
        var tempel = $('<div></div>');
        $('body').append(tempel);
        tempel.load(postCSSconfig.editPath + postCSSconfig.mapFile + ' #form__token', function(){
            var maptoken = tempel.find('input').attr('value');
            tempel.empty();
            tempel.load(postCSSconfig.editPath + postCSSconfig.cssFile + ' #form__token', function(){
                var csstoken = tempel.find('input').attr('value');
                tempel.remove();
                plugins.postcss([
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
                    from: 'styles.css',
                    to: 'styles.pkgd.css',
                    map: { inline: false }
                }).catch(function(result) {
                    alert(result);
                    $('button.package i').toggleClass('fa-spinner fa-spin').toggleClass('fa-indent');
                })
                .then(function (result) {
                    if(result){
                        result.css = result.css.replace(".css.map",".css.map?q="+moment().format("YYYYMMDDHHmmss"));
                        var cssopts = {
                            "form[_token]": csstoken,
                            "form[contents]": result.css
                        }
                        $.post(postCSSconfig.editPath + postCSSconfig.cssFile + '?returnto=ajax', cssopts, function(data){
                            console.log('done (css)');
                        });
                        var mapopts = {
                            "form[_token]": maptoken,
                            "form[contents]": result.map.toString()
                        }
                        $.post(postCSSconfig.editPath + postCSSconfig.mapFile + '?returnto=ajax', mapopts, function(data){
                            console.log('done (map)');
                            $('button.package i').toggleClass('fa-spinner fa-spin').toggleClass('fa-indent');
                        });
                    }else{
                        alert('Unkown error');
                    }
                });
            });
        });
    });
});