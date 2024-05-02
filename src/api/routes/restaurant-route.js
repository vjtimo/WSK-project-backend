/* eslint-disable new-cap */
import express from 'express';
import {getRestaurants} from '../controllers/restaurant-controller.js';
const restaurantRouter = express.Router();
restaurantRouter.route('/').get(getRestaurants);
export default restaurantRouter;
