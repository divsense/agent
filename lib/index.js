var restify = require('restify');
var path = require('path');
var fswalk = require('../lib/fswalk.js');

var adda = require("divsense-adda-helper");
//var adda = require("../../divsense-adda-helper/index.js");

var init = adda.init;
var makeNode = adda.makeNode;
var setChild = adda.setChild;
var toArray = adda.toArray;

var fileSkipRe = new RegExp(/(swp|~)$/);
var dirSkipRe;// = new RegExp(/node_modules/);

var cid;

var onFile = function( filepath, set, parent_id ){

	if( !fileSkipRe.test( filepath ) ){

		//                console.log("F", filepath, parent_id );

		var fl = ++cid;
		var txt = ++cid;
		var dvs = ++cid;

		set = makeNode( fl, {
			t: path.basename( filepath ),
			u: {type: "file",fold:"true"}
		})( set );


		set = makeNode( txt, {
			t: "Edit with text editor",
			u: {type: "command", command:"SIGNAL", tag: "text"},
			k: {icon: "fa-flash"},
		})( set );

		set = makeNode( dvs, {
			t: "Edit with Divsense",
			u: {type: "command", command:"SIGNAL", tag: "divsense"},
			k: {icon: "fa-flash"},
		})( set );

		set = setChild( parent_id, fl )( set );
		set = setChild( fl, txt )( set );
		set = setChild( fl, dvs )( set );
	}

	return [set, parent_id];
}

var onDir = function( dirpath, set, parent_id ){

	//                 console.log("D", dirpath, parent_id );

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

module.exports = function( port, root ){

	var server = restify.createServer({
		name: 'Divsense Agent',
		version: '1.0.0'
	});

	server.get("/", restify.serveStatic({
		directory: './lib',
		default: 'index.html'
	}));


	server.get('/fs', function (req, res, next) { //[[[1

		var fsres = toArray( buildfs( root ) );

		res.json( fsres );

	});

	server.listen( port, function () {
		console.log('%s @ %s\nroot folder: %s', server.name, server.url, root);
	});

}

