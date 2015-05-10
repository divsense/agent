var fs = require('fs');
var restify = require('restify');
var path = require('path');
var fswalk = require('../lib/fswalk.js');

var adda = require("adda-helper");

var init = adda.init;
var makeNode = adda.makeNode;
var setChild = adda.setChild;
var toArray = adda.toArray;

var fileSkipRe = new RegExp(/(swp|~)$/);
var dirSkipRe = new RegExp(/node_modules/);

var cid;

var onFile = function( filepath, set, parent_id ){

	if( !fileSkipRe.test( filepath ) ){


		var fl = ++cid;
		var txt = ++cid;
		var dvs = ++cid;

		set = makeNode( fl, {
			t: path.basename( filepath ),
			u: {type: "alienhead", body: "doc", fold: "true", signal: "content node parent", call: "save text divsense" },
			k: {icon: "fa-file-text-o", color:"#555"},
		})( set );

		set = makeNode( txt, {
			t: "text",
			u: {type: "signal", signal: "text"},
			k: {icon: "fa-bullseye"},
		})( set );

		set = makeNode( dvs, {
			t: "mmap",
			u: {type: "signal", signal: "divsense"},
			k: {icon: "fa-bullseye"},
		})( set );

		set = setChild( parent_id, fl )( set );
		set = setChild( fl, txt )( set );
		set = setChild( fl, dvs )( set );
	}

	return [set, parent_id];
}

var onDir = function( dirpath, set, parent_id ){

	var go = !dirSkipRe || !dirSkipRe.test( dirpath );

	++cid;

	set = makeNode( cid, {
		t: path.basename( dirpath ), 
		u: {type: "folder", fold: "true"}
	})( set );

	set = setChild( parent_id, cid )( set );

	return [ set, cid, go ];
}

var buildfs = function( root_path ){
	cid = 0;
	return fswalk( root_path, { file: onFile, dir: onDir }, init(), "__root__"); 
}

var getIndex = function(){
	return restify.serveStatic({ directory: __dirname, default: 'index.html' })
}

var getFS = function( root ){

	return function( req, res, next ){

		try{
			res.json( toArray( buildfs( root ) ) );
		}
		catch(e){
			res.end( 500, "error building fs" );
		}
	}

}

var getFile = function (req, res, next) {

//    console.log("FILE >>>", req.query, req.params);

	if( req.query.mode )
		fs.readFile( req.query.name, {encoding: "utf8"}, processFileContent )
	else
		res.end( 404, "unknown mode" );

	function processFileContent( err, data ){

		if( err ){
			res.end( 500, "error reading file" );
		}
		else{

			if( req.query.mode === "divsense" ){

			}
			else{

			}
			res.json( {data: data} );
		}

	}
}


module.exports = function( port, root ){

	var server = restify.createServer({
		name: 'Divsense Agent',
		version: '1.0.0'
	});

	server.use(restify.acceptParser(server.acceptable));
	server.use(restify.queryParser());
	server.use(restify.requestLogger());

	server.get("/", getIndex() );
	server.get('/fs', getFS( root ) );
	server.get('/file', getFile );

	server.listen( port, function () {
		console.log('%s @ %s\nroot folder: %s', server.name, server.url, root);
	});

}

