var uglifyjs = require('uglifyjs');

$('<button type="button" class="btn btn-success package" style="margin-left: 24px;"><i class="fa fa-indent"></i> Package JS</button>')
.insertAfter('.btn-default.confirm');

$('button.package').on('click', function () {
    $('button#saveeditfile').trigger('click');
});

$('button#saveeditfile').on('click', function () {
	var codemirror = $('.CodeMirror')[0].CodeMirror;
	$('button.package i').toggleClass('fa-spinner fa-spin').toggleClass('fa-indent');

	var files = [];
	var filelist = [];
	
	postCssUglifyJSconfig.jsIncludes.forEach(function (filename, index) {
		if (postCssUglifyJSconfig.use_relative_js_path) {
			filelist[index] = postCssUglifyJSconfig.themePath + filename;
		} else {
			filelist[index] = filename;
		}
		if (postCssUglifyJSconfig.currentPath == postCssUglifyJSconfig.editBase + filename) {
			files[index] = codemirror.getValue();
			checkDone();
		} else {
			$.get(filelist[index] + "?q=" + moment().format("YYYYMMDDHHmmss"), function (file) {
				files[index] = file;
				checkDone();
			}, 'text');
		}
	});
	
	function checkDone() {
		done = true;
		postCssUglifyJSconfig.jsIncludes.forEach(function (file, index) {
			if (files[index] == undefined) {
				done = false;
			}
		});
		if (done) {
			processJS();
		}
	}
	
	function processJS() {
		if (postCssUglifyJSconfig.use_relative_js_path) {
			postCssUglifyJSconfig.jsFile = postCssUglifyJSconfig.themePath + postCssUglifyJSconfig.jsFile;
		}
		
		var jsmapFile = postCssUglifyJSconfig.jsFile.split('/');
		jsmapFile = jsmapFile[jsmapFile.length - 1] + ".map?q=" + moment().format("YYYYMMDDHHmmss");

		var result = uglifyjs.UglifyJS.minify(files, { fromString: true, filelist: filelist, outSourceMap: jsmapFile });

		if (result) {
			var done = false;
			var jstempel = $('<div></div>');
			$('body').append(jstempel);
			jstempel.load(postCssUglifyJSconfig.editPath + postCssUglifyJSconfig.jsFile + ' #form__token', function () {
				var jsToken = jstempel.find('input').attr('value');
				jstempel.remove();
				var cssopts = {
					"form[_token]": jsToken,
					"form[contents]": result.code
				}
				$.post(postCssUglifyJSconfig.editPath + postCssUglifyJSconfig.jsFile + '?returnto=ajax', cssopts, function (data) {
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
			maptempel.load(postCssUglifyJSconfig.editPath + postCssUglifyJSconfig.jsFile + '.map #form__token', function () {
				var mapToken = maptempel.find('input').attr('value');
				maptempel.remove();
				var mapopts = {
					"form[_token]": mapToken,
					"form[contents]": result.map
				}
				$.post(postCssUglifyJSconfig.editPath + postCssUglifyJSconfig.jsFile + '.map?returnto=ajax', mapopts, function (data) {
					$('.lastsaved').append('<br>'+data.msg)
					if (done) {
						$('button.package i').toggleClass('fa-spinner fa-spin').toggleClass('fa-indent');
					} else {
						done = true;
					}
				});
			});
		} else {
			alert('Unkown error');
		}
	}
});