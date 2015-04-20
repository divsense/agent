#!/usr/bin/env node

var argv = require('minimist')(process.argv.slice(2));
var path = require('path');
var agent = require("../lib/index.js");

var port = argv.p || "8080";
var root = argv.r || ".";

var pseudo_root_path = path.join(__dirname, path.normalize( root ) );

agent( port, pseudo_root_path );

