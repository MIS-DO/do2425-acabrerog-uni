const http = require('http');
const express = require("express");
const { initialize } = require('@oas-tools/core');
//const console = require('./console')

const serverPort = 8087;
const app = express();

app.use(express.json({ limit: '50mb' }));

const config = {
  oasFile: "./api/oas-doc.yaml",
  middleware: {
    security: {
      auth: {
      }
    }
  }
}

// Initialize database before running the app
var db = require('./db');

db.connect(function (err, _db) {  
  console.info('Initializing DB...');
  if (err) {
    console.error('Error connecting to DB!', err);
    return 1;
  } else {
    db.find({}, function (err, apartments) {
      if (err) {
        console.error('Error while getting initial data from DB!', err);
      } else {
        if (apartments.length === 0) {
          console.info('Empty DB, loading initial data...');
          db.init();
        } else {
          console.info('DB already has ' + apartments.length + ' apartments!');
        }
      }
    });
  }
});

initialize(app, config).then(() => {
  http.createServer(app).listen(serverPort, () => {
    console.info("\nApp running at http://localhost:" + serverPort);
    console.info("________________________________________________________________");
    if (!config?.middleware?.swagger?.disable) {
      console.info('API docs (Swagger UI) available on http://localhost:' + serverPort + '/docs');
      console.info("________________________________________________________________");
    }
  });
});