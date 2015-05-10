var util = require("util");
var fs = require("fs");

var hiddenRE = new RegExp("/\\.","g");

var isUnixHiddenPath = function (path) { 
	return hiddenRE.test(path); 
}

var walk = function( path, fns, data, context ){

	var res, files = fs.readdirSync( path );
	var dirs = [];

	files.forEach(function(f){

		var currentFile = path + '/' + f;

		if( !isUnixHiddenPath( currentFile ) ){

			var stats = fs.statSync( currentFile );

			if (stats.isFile()) {
				res = fns.file( currentFile, data, context );
				//
				// res[0] : data
				// res[1] : context
				//
				data = res[0];
			}
			else if (stats.isDirectory()) {
				res = fns.dir( currentFile, data, context );
				//
				// res[0] : data
				// res[1] : context
				// res[2] : stop/go
				//
				data = res[0];
				if( res[2] ){
					dirs.push( [ currentFile, fns, data, res[1] ] );
				}
			}
		}
	});

	return dirs.length ? dirs.reduce( function(data, dir){ 
		return walk.apply( null, dir ) 
	}, data ) : data;

}

module.exports = function( path, fns, data, context ){
	return walk( path, fns, data, context );
}
