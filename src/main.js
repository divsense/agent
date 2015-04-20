var ALIEN_ID = "agent";

var request = require("superagent");

var alienBody = require("divsense-alien-body")( ALIEN_ID );
//var alienBody = require("../../divsense-alien-body/index.js")( ALIEN_ID, true );

var handleHeadEvent = function(req, res, next){

	console.log( "AGENT. INIT HEAD:", req );

	var input = req.params.user_input;
	var url = "localhost:" + input;

	request.get("/fs")
		   .set('Accept', 'application/json')
		   .end(function(err,cres){
//               console.log(">>CLIENT", err, cres.body );
			   res.content = { 
				   head:{
						icon: "fa-cube",
						text: url,
						content: cres.body 
					}
			   };
			   next( res );
		   });


}


//alienBody.on("channel", handleChannelEvent );

alienBody.on("head", handleHeadEvent );
