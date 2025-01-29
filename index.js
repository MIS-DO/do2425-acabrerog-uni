const http = require('http');
const express = require("express");
const { initialize } = require('@oas-tools/core');
const logger = require('./logger')

const serverPort = 8080;
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
  logger.info('Initializing DB...');
  if (err) {
    logger.error('Error connecting to DB!', err);
    return 1;
  } else {
    db.find({}, function (err, apartments) {
      if (err) {
        logger.error('Error while getting initial data from DB!', err);
      } else {
        if (apartments.length === 0) {
          logger.info('Empty DB, loading initial data...');
          db.init();
        } else {
          logger.info('DB already has ' + apartments.length + ' apartments!');
        }
      }
    });
  }
});

initialize(app, config).then(() => {
  http.createServer(app).listen(serverPort, () => {
    logger.info("\nApp running at http://localhost:" + serverPort);
    logger.info("________________________________________________________________");
    if (!config?.middleware?.swagger?.disable) {
      logger.info('API docs (Swagger UI) available on http://localhost:' + serverPort + '/docs');
      logger.info("________________________________________________________________");
    }
  });
});