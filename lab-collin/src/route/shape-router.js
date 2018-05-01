'use strict';

import { Router } from 'express';
import bodyParser from 'body-parser';
import Shape from '../model/shape';
import logger from '../lib/logger';

const jsonParser = bodyParser.json();

const shapeRouter = new Router();

shapeRouter.post('/api/shapes', jsonParser, (request, response) => {
  logger.log(logger.INFO, 'POST - processing a request');
  if (!request.body.name) {
    logger.log(logger.INFO, 'Responding with a 400 error code');
    return response.sendStatus(400);
  }
  if (!request.body.sides) {
    logger.log(logger.INFO, 'Responding with a 400 error code');
    return response.sendStatus(400);
  }
  return new Shape(request.body).save()
    .then((shape) => {
      logger.log(logger.INFO, 'POST - responding with a 200 status code');
      return response.json(shape);
    })
    .catch((error) => {
      logger.log(logger.ERROR, '__POST_ERROR__');
      logger.log(logger.ERROR, error);
      return response.sendStatus(500);
    });
});


shapeRouter.get('/api/shapes/:id', (request, response) => {
  logger.log(logger.INFO, 'GET - processing a request');

  return Shape.findById(request.params.id)
    .then((shape) => { 
      if (!shape) {
        logger.log(logger.INFO, 'GET - responding with a 404 status code - (!shape)');
        return response.sendStatus(404);
      }
      logger.log(logger.INFO, 'GET - responding with a 200 status code');
      return response.json(shape);
    })
    .catch((error) => { 
      if (error.message.toLowerCase().indexOf('cast to objectid failed') > -1) {
        logger.log(logger.INFO, 'GET - responding with a 404 status code - objectId');
        logger.log(logger.VERBOSE, `Could not parse the specific object id ${request.params.id}`);
        return response.sendStatus(404);
      }
      logger.log(logger.ERROR, '__GET_ERROR__ Returning a 500 status code');
      logger.log(logger.ERROR, error);
      return response.sendStatus(500);
    });
});

shapeRouter.delete('/api/shapes/:id', (request, response) => {
  logger.log(logger.INFO, 'DELETE - processing a request');

  return Shape.findByIdAndRemove(request.params.id)
    .then((shape) => { 
      if (!shape) {
        logger.log(logger.INFO, 'DELETE - responding with a 404 status code - (!shape)');
        return response.sendStatus(404);
      }
      logger.log(logger.INFO, 'DELETE - responding with a 200 status code');
      return response.json(shape);
    })
    .catch((error) => { 
      if (error.message.toLowerCase().indexOf('cast to objectid failed') > -1) {
        logger.log(logger.INFO, 'DELETE - responding with a 404 status code - objectId');
        logger.log(logger.VERBOSE, `Could not parse the specific object id ${request.params.id}`);
        return response.sendStatus(404);
      }
      logger.log(logger.ERROR, '__DELETE_ERROR__ Returning a 500 status code');
      logger.log(logger.ERROR, error);
      return response.sendStatus(500);
    });
});

export default shapeRouter;
