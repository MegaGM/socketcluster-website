var fs = require('fs');
var path = require('path');
var express = require('express');
var serveStatic = require('serve-static');

module.exports.run = function (worker) {
  console.log('   >> Worker PID:', process.pid);

  var app = require('express')();

  // Get a reference to our raw Node HTTP server
  var httpServer = worker.getHTTPServer();
  // Get a reference to our WebSocket server
  var scServer = worker.getSCServer();

  var mainNavFile = __dirname + '/public/app/shared/nav.html';
  var mainNavContent = fs.readFileSync(mainNavFile, {encoding: 'utf8'});

  var subNavFile = __dirname + '/public/app/shared/nav-docs.html';
  var subNavContent = fs.readFileSync(subNavFile, {encoding: 'utf8'});

  var navContent = mainNavContent + subNavContent;

  var publicDir = path.normalize(__dirname + '/public/');

  var templateTagsRegex = /\{{2,3}[^{}]*\}{2,3}/g;
  var escapedFragmentRegex = /^\/[?]_escaped_fragment_=(.*)/;
  var fragment, page;
  app.use(function (req, res, next) {
    fragment = req.url.match(escapedFragmentRegex);
    if (fragment) {
      res.writeHead(404, {
        'Content-Type': 'text/html'
      });
      res.end();
    } else {
      next();
    }
  });

  app.use(serveStatic(__dirname + '/public'));

  httpServer.on('request', app);

  // var randInterval = setInterval(function () {
  //   scServer.global.publish('rand', Math.round(Math.random() * 100000));
  // }, 1000);
};
