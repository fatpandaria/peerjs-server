#!/usr/bin/env node

const path = require('path');
const pkg = require('./package.json');
const fs = require('fs');
const version = pkg.version;
const PeerServer = require('./src').PeerServer;
const opts = require('./config/myconfig.js');

process.on('uncaughtException', function (e) {
  console.error('Error: ' + e);
});

if (opts.sslkey || opts.sslcert) {
  if (opts.sslkey && opts.sslcert) {
    opts.ssl = {
      key: fs.readFileSync(path.resolve(opts.sslkey)),
      cert: fs.readFileSync(path.resolve(opts.sslcert))
    };

    delete opts.sslkey;
    delete opts.sslcert;
  } else {
    console.error('Warning: PeerServer will not run because either ' +
      'the key or the certificate has not been provided.');
    process.exit(1);
  }
}
console.log(opts);
const userPath = opts.path;
const server = PeerServer(opts, server => {
  const host = server.address().address;
  const port = server.address().port;

  console.log(
    'Started PeerServer on %s, port: %s, path: %s (v. %s)',
    host, port, userPath || '/', version
  );
});

server.on('connection', client => {
  console.log(`Client connected: ${client.getId()}`);
});

server.on('disconnect', client => {
  console.log(`Client disconnected: ${client.getId()}`);
});
