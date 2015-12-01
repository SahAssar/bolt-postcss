var postcss = require("postcss");

var space = postcss.list.space;

module.exports = postcss.plugin("postcss-import-url", postcssImportUrl);

function postcssImportUrl(options) {
	options = options || {};
	return function (css) {
		var imports = [];
		css.walkAtRules("import", function checkAtRule(atRule) {
			var params = space(atRule.params);
			var remoteFile = cleanupRemoteFile(params[0]);
			var mediaQueries = params.slice(1).join("");
			var promise = createPromise(remoteFile).then(function (otherNodes) {
				if (mediaQueries) {
					var mediaNode = postcss.atRule({ name: "media", params: mediaQueries });
					mediaNode.append(otherNodes);
					otherNodes = mediaNode;
				}
				atRule.replaceWith(otherNodes);
			});
			imports.push(promise);
		});
		return Promise.all(imports);
	};
}

function cleanupRemoteFile(value) {
	if (value.substr(0, 3) === "url") {
		value = value.substr(3);
	}
	value = value.trim().replace(/["']/g, "");
	return value;
}

function createPromise(remoteFile) {
	function executor(resolve, reject) {
		$.get(remoteFile, function (data) { resolve(data) });
	}
	return new Promise(executor);
}