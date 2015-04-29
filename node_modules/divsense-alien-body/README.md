# Divsense Alien Body

## Usage:
```javascript
var alienId = "my-awesome-divsense-alien";
var alienBody = require("divsense-alien-body")( alienId );

alienBody.on("initHead", function( req, res, next ){
  
  res.content.head.icon = "fa-cube";
  
  next( res );

});
```
