var util = require("util");
var fs = require("fs");

var walk = function( path, fns, data, context ){

	var res, files = fs.readdirSync( path );
	var dirs = [];

	files.forEach(function(f){

		var currentFile = path + '/' + f;

		var stats = fs.statSync( currentFile );

		if (stats.isFile()) {
			res = fns.file( currentFile, data, context );
			//
			// res[0] : data
			// res[1] : context
			//
			data = res[0];
//            context = res[1];
		}
		else if (stats.isDirectory()) {
			res = fns.dir( currentFile, data, context );
			//
			// res[0] : data
			// res[1] : context
			// res[2] : stop/go
			//
			data = res[0];
//            context = res[1];
			if( res[2] ){
				dirs.push( [ currentFile, fns, data, res[1] ] );
			}
		}
	});

	return dirs.length ? dirs.reduce( function(data, dir){ 
//        var tt = walk.apply( null, dir ) ;
//        return tt;

		return walk.apply( null, dir ) 
	}, data ) : data;

}

module.exports = function( path, fns, data, context ){
	return walk( path, fns, data, context );
}
