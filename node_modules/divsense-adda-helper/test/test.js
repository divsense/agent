var assert = require("assert");
var adda = require("../index.js");

describe("ADDA Helper", function(){

	describe("makeNode", function(){

		it("should return ADDA object with new node", function(){

			var set = adda.makeNode( 12, "Foo", {type: "command"}, {fontstyle:"italic"} )( {} );

			assert.equal( set[12].t, "Foo" );

			assert.equal( set[12].u[0][0], "type" );
			assert.equal( set[12].u[0][1], "command" );

			assert.equal( set[12].k[0][0], "fontstyle" );
			assert.equal( set[12].k[0][1], "italic" );

			assert.equal( typeof set[12].c, "undefined" );

		});


	});

	describe("init", function(){

		it("should return ADDA object with root node", function(){

			var set = adda.init();

			assert.ok( set["__root__"] );

		});


	});

	describe("setChild", function(){

		it("should return ADDA object with one node as a child of another", function(){

			var set = adda.init();
			set = adda.makeNode(1)( set );
			set = adda.setChild("__root__", 1)( set );

			assert.ok( set["__root__"].c );
			assert.equal( set["__root__"].c[0][0], "children-mmap" );
			assert.equal( set["__root__"].c[0][1][0], 1 );

		});


	});

	describe("setChildNodes", function(){

		it("should assign child nodes", function(){

			var set = adda.init();
			set = adda.makeNode("a")( set );
			set = adda.makeNode("b")( set );
			set = adda.setChildNodes("__root__", ["a","b"] )( set );

			assert.ok( set["__root__"].c );
			assert.equal( set["__root__"].c[0][0], "children-mmap" );
			assert.equal( set["__root__"].c[0][1][0], "a" );
			assert.equal( set["__root__"].c[0][1][1], "b" );

		});

	});

	describe("toArray", function(){

		it("should convert ADDA object into array of nodes", function(){

			var set = adda.init();
			set = adda.makeNode("a")( set );
			set = adda.setChild("__root__", "a" )( set );

			var arr = adda.toArray( set );

			assert.ok( Array.isArray( arr ) );

			assert.ok( arr.indexOf( set["__root__"] ) !== -1 );
			assert.ok( arr.indexOf( set["a"] ) !== -1 );

		});

	});



});

