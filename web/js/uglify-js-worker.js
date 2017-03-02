onmessage = function(e) {
    if(e.data.path){
        importScripts(e.data.path + 'bolt-uglifyjs.pkgd.js');
    }
    if(e.data.files){
        try {
            var result = uglifyjspackage.uglifyjs.minify(
                Object.keys(e.data.files).map(function (key) { return e.data.files[key]; }).join(''),
                { fromString: true, filelist: Object.keys(e.data.files) }
            );
            postMessage({result: result});
        }
        catch (e) {
            console.log(e);
            postMessage({err: e});
        }
    }
}