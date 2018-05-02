'use strict';

import superagent from 'superagent';
import Shape from '../model/shape';
import { startServer, stopServer } from '../lib/server';

const apiURL = `http://localhost:${process.env.PORT}/api/shapes`;

const createShapeMock = () => {
  return new Shape({
    name: 'triangle',
    sides: 3,
  }).save();
};

describe('/api/shapes', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  afterEach(() => Shape.remove({}));
  test('POST - It should respond with a 200 status ', () => {
    const shapeToPost = {
      name: 'triangle',
      sides: 3,
    };
    return superagent.post(apiURL)
      .send(shapeToPost)
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.body.name).toEqual(shapeToPost.name);
        expect(response.body.sides).toEqual(shapeToPost.sides);
        expect(response.body._id).toBeTruthy();
      });
  });
  test('POST - It should respond with a 400 status ', () => {
    const shapeToPost = {
      name: 'square',
    };
    return superagent.post(apiURL)
      .send(shapeToPost)
      .then(Promise.reject)
      .catch((response) => {
        expect(response.status).toEqual(400);
      });
  });
  describe('GET /api/shapes', () => {
    test('should respond with 200 if there are no errors', () => {
      let shapeToTest = null; 
      return createShapeMock()
        .then((shape) => {
          shapeToTest = shape;
          return superagent.get(`${apiURL}/${shape._id}`);
        })
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body.name).toEqual(shapeToTest.name);
          expect(response.body.sides).toEqual(shapeToTest.sides);
        });
    });
    test('should respond with 404 if a shape is not found', () => {
      return superagent.get(`${apiURL}/777778??`)
        .then(Promise.reject)
        .catch((response) => {
          expect(response.status).toEqual(404);
        });
    });
  });
  describe('DELETE /api/shapes', () => {
    test('should respond with 204 if there are no errors', () => {
      let shapeToTest = null; // eslint-disable-line no-unused-vars
      return createShapeMock()
        .then((shape) => {
          shapeToTest = shape;
          return superagent.delete(`${apiURL}/${shape._id}`);
        })
        .then((response) => {
          expect(response.status).toEqual(204);
        });
    });
    test('should respond with 404 if a shape is not found', () => {
      return superagent.get(`${apiURL}/777778??`)
        .then(Promise.reject)
        .catch((response) => {
          expect(response.status).toEqual(404);
        });
    });
  });
});
